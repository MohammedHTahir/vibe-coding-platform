'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface ActionState {
  error?: string
  success?: string
}

const MAX_AVATAR_BYTES = 2 * 1024 * 1024 // 2 MB
const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in.' }

  const displayName = String(formData.get('display_name') ?? '').trim()
  if (displayName.length > 80) {
    return { error: 'Display name must be 80 characters or less.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName || null })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/account')
  return { success: 'Profile updated.' }
}

export async function uploadAvatar(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in.' }

  const file = formData.get('avatar')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Please choose an image to upload.' }
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { error: 'Avatar must be 2 MB or smaller.' }
  }
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return { error: 'Use a PNG, JPEG, or WebP image.' }
  }

  const ext =
    file.type === 'image/png'
      ? 'png'
      : file.type === 'image/webp'
      ? 'webp'
      : 'jpg'
  // Folder = user id (matches the RLS policy on storage.objects)
  const path = `${user.id}/avatar-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })
  if (uploadError) return { error: uploadError.message }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(path)

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)
  if (profileError) return { error: profileError.message }

  revalidatePath('/account')
  return { success: 'Avatar updated.' }
}
