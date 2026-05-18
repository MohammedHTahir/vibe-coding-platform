import { type ChatUIMessage } from '@/components/chat/types'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from 'ai'
import { DEFAULT_MODEL, MODEL_NAMES, SUPPORTED_MODELS } from '@/ai/constants'
import { NextResponse } from 'next/server'
import { getModelOptions } from '@/ai/gateway'
import { checkBotId } from 'botid/server'
import { tools } from '@/ai/tools'
import { createClient } from '@/lib/supabase/server'
import {
  assertCredits,
  creditsForRun,
  debitCredits,
  MODEL_CREDIT_COST,
} from '@/lib/credits'
import prompt from './prompt.md'

interface BodyData {
  messages: ChatUIMessage[]
  modelId?: string
  reasoningEffort?: 'low' | 'medium'
}

export async function POST(req: Request) {
  const [checkResult, { messages, modelId = DEFAULT_MODEL, reasoningEffort }] =
    await Promise.all([checkBotId(), req.json() as Promise<BodyData>])

  if (checkResult.isBot) {
    return NextResponse.json({ error: `Bot detected` }, { status: 403 })
  }

  if (!SUPPORTED_MODELS.includes(modelId)) {
    return NextResponse.json(
      { error: `Model ${modelId} not found.` },
      { status: 400 }
    )
  }

  // Authenticated users only — credits are tracked per user. We treat
  // missing Supabase env vars as "credits disabled" so local dev without
  // a Supabase project still works.
  let userId: string | null = null
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to run the agent.', code: 'unauthenticated' },
        { status: 401 }
      )
    }
    userId = user.id

    // Pre-check the user can afford at least one minimum-cost turn for the
    // chosen model. This stops the request before we hit the gateway when
    // the user is clearly out.
    const minCost = MODEL_CREDIT_COST[modelId]?.base ?? 1
    const precheck = await assertCredits(userId, minCost)
    if (!precheck.ok) {
      return NextResponse.json(
        {
          error: 'Out of credits.',
          code: 'insufficient_credits',
          balance: precheck.balance,
          needed: precheck.needed,
        },
        { status: 402 }
      )
    }
  }

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        const result = streamText({
          ...getModelOptions(modelId, { reasoningEffort }),
          system: prompt,
          messages: await convertToModelMessages(
            messages.map((message) => {
              message.parts = message.parts.map((part) => {
                if (part.type === 'data-report-errors') {
                  return {
                    type: 'text',
                    text:
                      `There are errors in the generated code. This is the summary of the errors we have:\n` +
                      `\`\`\`${part.data.summary}\`\`\`\n` +
                      (part.data.paths?.length
                        ? `The following files may contain errors:\n` +
                          `\`\`\`${part.data.paths?.join('\n')}\`\`\`\n`
                        : '') +
                      `Fix the errors reported.`,
                  }
                }
                return part
              })
              return message
            })
          ),
          stopWhen: stepCountIs(20),
          tools: tools({ modelId, writer }),
          onError: (error) => {
            console.error('Error communicating with AI')
            console.error(JSON.stringify(error, null, 2))
          },
          onFinish: async ({ usage }) => {
            if (!userId) return
            const outputTokens =
              (usage as { outputTokens?: number; completionTokens?: number })
                ?.outputTokens ??
              (usage as { completionTokens?: number })?.completionTokens ??
              0
            const cost = creditsForRun({ modelId, outputTokens })
            await debitCredits({
              userId,
              amount: cost,
              agentRunId: null,
              model: modelId,
              metadata: { output_tokens: outputTokens },
            })
          },
        })
        result.consumeStream()
        writer.merge(
          result.toUIMessageStream({
            sendReasoning: true,
            sendStart: false,
            messageMetadata: () => ({
              model: MODEL_NAMES[modelId] ?? modelId,
            }),
          })
        )
      },
    }),
  });
}
