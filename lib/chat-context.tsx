'use client'

import { type ChatUIMessage } from '@/components/chat/types'
import { type ReactNode } from 'react'
import { Chat } from '@ai-sdk/react'
import { DataPart } from '@/ai/messages/data-parts'
import { DataUIPart } from 'ai'
import { createContext, useContext, useMemo, useRef } from 'react'
import { useDataStateMapper } from '@/app/dashboard/state'
import { mutate } from 'swr'
import { toast } from 'sonner'

interface ChatContextValue {
  chat: Chat<ChatUIMessage>
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

/**
 * Tries to surface a richer toast for known server error codes — most
 * importantly the 402 from the credits gate. The AI SDK swallows the
 * original Response, so we parse the error message it produces.
 */
function reportChatError(error: Error) {
  const text = error.message ?? ''
  // Server returns: { error, code: 'insufficient_credits', balance, needed }
  if (text.includes('insufficient_credits') || text.includes('Out of credits')) {
    toast.error('Out of credits', {
      description: 'Buy more credits or upgrade your plan to continue.',
      action: {
        label: 'Buy more',
        onClick: () => {
          window.location.href = '/account/billing'
        },
      },
    })
    return
  }
  if (text.includes('unauthenticated') || text.includes('signed in')) {
    toast.error('Please sign in to run the agent.', {
      action: {
        label: 'Sign in',
        onClick: () => {
          window.location.href = '/login?redirect=/dashboard'
        },
      },
    })
    return
  }
  toast.error(`Communication error with the AI: ${error.message}`)
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const mapDataToState = useDataStateMapper()
  const mapDataToStateRef = useRef(mapDataToState)
  mapDataToStateRef.current = mapDataToState

  const chat = useMemo(
    () =>
      new Chat<ChatUIMessage>({
        onToolCall: () => mutate('/api/auth/info'),
        onData: (data: DataUIPart<DataPart>) => mapDataToStateRef.current(data),
        onError: (error) => {
          reportChatError(error)
          console.error('Error sending message:', error)
        },
      }),
    []
  )

  return (
    <ChatContext.Provider value={{ chat }}>{children}</ChatContext.Provider>
  )
}

export function useSharedChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useSharedChatContext must be used within a ChatProvider')
  }
  return context
}
