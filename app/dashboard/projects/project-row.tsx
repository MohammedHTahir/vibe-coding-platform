'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ExternalLinkIcon,
  PencilIcon,
  Trash2Icon,
  PlayIcon,
} from 'lucide-react'
import { deleteProject, renameProject } from './actions'

interface Project {
  id: string
  name: string
  description: string | null
  sandbox_id: string | null
  preview_url: string | null
  created_at: string
  updated_at: string
}

const initialState: { error?: string; success?: string } = {}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ProjectRow({ project }: { project: Project }) {
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameState, renameAction, renamePending] = useActionState(
    renameProject,
    initialState
  )
  const [, deleteAction, deletePending] = useActionState(
    deleteProject,
    initialState
  )

  return (
    <li className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-medium text-gray-900 truncate">
            {project.name}
          </h3>
          {project.sandbox_id ? (
            <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-mono">
              {project.sandbox_id.slice(0, 8)}
            </span>
          ) : null}
        </div>
        {project.description ? (
          <p className="text-[13px] text-gray-500 mt-1 line-clamp-2">
            {project.description}
          </p>
        ) : null}
        <p className="text-[11px] text-gray-400 mt-2">
          Updated {formatDate(project.updated_at)}
        </p>
      </div>

      <div className="flex items-center gap-1.5 sm:flex-shrink-0">
        {project.preview_url ? (
          <Button asChild variant="outline" size="sm">
            <a
              href={project.preview_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </a>
          </Button>
        ) : null}

        <Button asChild size="sm" className="bg-blue-500 hover:bg-blue-600">
          <Link href="/dashboard">
            <PlayIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open</span>
          </Link>
        </Button>

        <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Rename project">
              <PencilIcon className="w-3.5 h-3.5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename project</DialogTitle>
              <DialogDescription>
                Pick a name that helps you remember what this build was about.
              </DialogDescription>
            </DialogHeader>
            <form
              action={async (fd) => {
                await renameAction(fd)
                setRenameOpen(false)
              }}
              className="space-y-3"
            >
              <input type="hidden" name="id" value={project.id} />
              <Input
                name="name"
                defaultValue={project.name}
                maxLength={80}
                autoFocus
                required
              />
              {renameState.error ? (
                <p className="text-[12px] text-red-600">{renameState.error}</p>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRenameOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={renamePending}
                >
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <form action={deleteAction}>
          <input type="hidden" name="id" value={project.id} />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            aria-label="Delete project"
            disabled={deletePending}
            onClick={(e) => {
              if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) {
                e.preventDefault()
              }
            }}
          >
            <Trash2Icon className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </li>
  )
}
