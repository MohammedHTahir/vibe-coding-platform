'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface ActionState {
  error?: string
  success?: string
}

const NAME_MAX = 80
const DESC_MAX = 280

function trimAndCap(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().slice(0, max)
  return trimmed.length > 0 ? trimmed : null
}

/**
 * Insert (or update) a project record for the currently signed-in user.
 *
 * Called from the dashboard client when the agent finishes creating a sandbox.
 * We store sandboxId, preview URL, and the first prompt (description) so the
 * list view is useful. RLS guarantees user_id isolation; we still set it
 * explicitly for clarity.
 */
export async function recordProject(input: {
  sandboxId: string
  name?: string | null
  description?: string | null
  previewUrl?: string | null
}): Promise<{ id?: string; error?: string }> {
  if (!input?.sandboxId) return { error: 'sandboxId is required' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in.' }

  const name =
    trimAndCap(input.name, NAME_MAX) ??
    trimAndCap(input.description, NAME_MAX) ??
    'Untitled project'
  const description = trimAndCap(input.description, DESC_MAX)
  const previewUrl = trimAndCap(input.previewUrl, 2048)

  // Look up an existing row first so we update instead of duplicate.
  const { data: existing } = await supabase
    .from('projects')
    .select('id')
    .eq('user_id', user.id)
    .eq('sandbox_id', input.sandboxId)
    .maybeSingle()

  if (existing?.id) {
    const { error } = await supabase
      .from('projects')
      .update({
        name,
        description,
        preview_url: previewUrl,
      })
      .eq('id', existing.id)
    if (error) return { error: error.message }
    revalidatePath('/dashboard/projects')
    return { id: existing.id }
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      description,
      preview_url: previewUrl,
      sandbox_id: input.sandboxId,
    })
    .select('id')
    .single()

  if (error || !data) return { error: error?.message ?? 'Insert failed.' }

  revalidatePath('/dashboard/projects')
  return { id: data.id }
}

/**
 * Update preview URL on an existing project once the agent gets one.
 */
export async function updateProjectPreview(
  sandboxId: string,
  previewUrl: string
): Promise<{ error?: string }> {
  if (!sandboxId || !previewUrl) return {}

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in.' }

  const { error } = await supabase
    .from('projects')
    .update({ preview_url: previewUrl })
    .eq('user_id', user.id)
    .eq('sandbox_id', sandboxId)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/projects')
  return {}
}

export async function renameProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get('id') ?? '')
  const name = trimAndCap(formData.get('name'), NAME_MAX)
  if (!id || !name) return { error: 'Project name is required.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in.' }

  const { error } = await supabase
    .from('projects')
    .update({ name })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/projects')
  return { success: 'Renamed.' }
}

export async function deleteProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get('id') ?? '')
  if (!id) return { error: 'Missing project id.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in.' }

  // Best-effort cleanup of associated storage objects under the user's folder.
  // The bucket policy allows the owner to list/delete their own folder.
  const folder = `${user.id}/${id}`
  const { data: files } = await supabase.storage
    .from('project-files')
    .list(folder, { limit: 1000 })

  if (files && files.length > 0) {
    await supabase.storage
      .from('project-files')
      .remove(files.map((f) => `${folder}/${f.name}`))
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/projects')
  return { success: 'Deleted.' }
}
