'use client'

import type { ChatUIMessage } from '@/components/chat/types'
import { TEST_PROMPTS } from '@/ai/constants'
import {
  MessageCircleIcon,
  SendIcon,
  SparklesIcon,
  ArrowRightIcon,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Input } from '@/components/ui/input'
import { Message } from '@/components/chat/message'
import { ModelSelector } from '@/components/settings/model-selector'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { Settings } from '@/components/settings/settings'
import { useChat } from '@ai-sdk/react'
import { useLocalStorageValue } from '@/lib/use-local-storage-value'
import { useCallback, useEffect, useState } from 'react'
import { useSharedChatContext } from '@/lib/chat-context'
import { useSettings } from '@/components/settings/use-settings'
import { useSandboxStore } from './state'

interface Props {
  className: string
  modelId?: string
}

export function Chat({ className }: Props) {
  const [input, setInput] = useLocalStorageValue('prompt-input')
  const { chat } = useSharedChatContext()
  const { modelId, reasoningEffort } = useSettings()
  const { messages, sendMessage, status } = useChat<ChatUIMessage>({ chat })
  const { setChatStatus } = useSandboxStore()
  const [outOfCredits, setOutOfCredits] = useState(false)

  const validateAndSubmitMessage = useCallback(
    (text: string) => {
      if (text.trim()) {
        setOutOfCredits(false)
        sendMessage({ text }, { body: { modelId, reasoningEffort } })
        setInput('')
      }
    },
    [sendMessage, modelId, setInput, reasoningEffort]
  )

  useEffect(() => {
    setChatStatus(status)
  }, [status, setChatStatus])

  // Listen for 402 errors to show the inline banner
  useEffect(() => {
    if (status === 'error') {
      // Check if the last error was a credits issue
      const lastMsg = messages[messages.length - 1]
      if (!lastMsg) return
      // The error toast handler in chat-context.tsx already fires; we
      // also show the inline banner for visibility.
      setOutOfCredits(true)
    }
  }, [status, messages])

  return (
    <Panel className={className}>
      <PanelHeader>
        <div className="flex items-center gap-1.5 font-medium">
          <MessageCircleIcon className="w-3.5 h-3.5" />
          <span>Chat</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {status === 'streaming' ? (
            <span className="flex items-center gap-1 text-[11px] text-blue-500">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Generating
            </span>
          ) : null}
        </div>
      </PanelHeader>

      {/* Out of credits inline banner */}
      {outOfCredits ? (
        <div className="mx-3 mt-3 rounded-xl border border-red-500/20 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <SparklesIcon className="size-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-medium text-foreground">
                You&apos;re out of credits
              </h3>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                Purchase credits or upgrade your plan to continue building.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Button
                  asChild
                  size="sm"
                  className="h-7 text-[11px] bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
                >
                  <Link href="/account/billing">
                    Buy credits
                    <ArrowRightIcon className="size-3 ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[11px] text-muted-foreground"
                >
                  <Link href="/pricing">View plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Messages Area */}
      {messages.length === 0 && !outOfCredits ? (
        <div className="flex-1 min-h-0">
          <div className="flex flex-col justify-center items-center h-full px-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <SparklesIcon className="size-5 text-blue-500" />
            </div>
            <h2 className="text-[15px] font-medium text-foreground mb-1">
              What do you want to build?
            </h2>
            <p className="text-[12px] text-muted-foreground mb-6 text-center max-w-xs">
              Describe your app and the agent will generate it in a live sandbox.
            </p>
            <div className="grid gap-2 w-full max-w-sm">
              {TEST_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/30 text-left text-[12px] text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border transition-all cursor-pointer"
                  onClick={() => validateAndSubmitMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : messages.length > 0 ? (
        <Conversation className="relative w-full">
          <ConversationContent className="space-y-4">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      ) : (
        <div className="flex-1" />
      )}

      {/* Input bar */}
      <form
        className="flex items-center gap-1.5 p-2.5 border-t border-border/40 bg-secondary/20"
        onSubmit={async (event) => {
          event.preventDefault()
          validateAndSubmitMessage(input)
        }}
      >
        <Settings />
        <ModelSelector />
        <Input
          className="flex-1 h-9 text-[13px] rounded-lg border-border/50 bg-background placeholder:text-muted-foreground/60"
          disabled={status === 'streaming' || status === 'submitted'}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you want to build..."
          value={input}
        />
        <Button
          type="submit"
          size="sm"
          disabled={status !== 'ready' || !input.trim()}
          className="h-9 w-9 p-0 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 disabled:opacity-40"
        >
          <SendIcon className="w-3.5 h-3.5" />
        </Button>
      </form>
    </Panel>
  )
}
