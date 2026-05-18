'use client'

import { useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { useSharedChatContext } from '@/lib/chat-context'
import { useSandboxStore } from './state'
import {
  recordProject,
  updateProjectPreview,
} from './projects/actions'

/**
 * Listens for sandbox creation + preview-URL events and persists a
 * `public.projects` row through server actions. Mounted once per dashboard
 * session; renders nothing.
 *
 * The original Vercel Sandbox + AI Gateway pipeline is untouched — this
 * component only records side data into Supabase.
 */
export function ProjectsRecorder() {
  const { chat } = useSharedChatContext()
  const { messages } = useChat({ chat })
  const { sandboxId, url } = useSandboxStore()

  const recordedSandboxes = useRef<Set<string>>(new Set())
  const recordedPreviewUrls = useRef<Map<string, string>>(new Map())

  // Try to derive a useful name/description from the first user message.
  const firstPrompt = messages
    .find((m) => m.role === 'user')
    ?.parts.find((p) => p.type === 'text')?.text

  // Insert (or update) the project row when a sandbox is first created.
  useEffect(() => {
    if (!sandboxId) return
    if (recordedSandboxes.current.has(sandboxId)) return
    recordedSandboxes.current.add(sandboxId)

    void recordProject({
      sandboxId,
      name: firstPrompt ? firstPrompt.split('\n')[0].slice(0, 80) : null,
      description: firstPrompt ?? null,
      previewUrl: url ?? null,
    }).catch(() => {
      // Silently ignore — the agent itself isn't blocked by record failures
      // (e.g. user signed out mid-session).
      recordedSandboxes.current.delete(sandboxId)
    })
  }, [sandboxId, firstPrompt, url])

  // Once we get a preview URL, attach it to the existing project row.
  useEffect(() => {
    if (!sandboxId || !url) return
    if (recordedPreviewUrls.current.get(sandboxId) === url) return
    recordedPreviewUrls.current.set(sandboxId, url)

    void updateProjectPreview(sandboxId, url).catch(() => {
      recordedPreviewUrls.current.delete(sandboxId)
    })
  }, [sandboxId, url])

  return null
}
