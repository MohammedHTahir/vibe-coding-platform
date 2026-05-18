'use client'

import { useActionState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadIcon } from 'lucide-react'
import { updateProfile, uploadAvatar } from './actions'

interface Profile {
  email: string | null
  displayName: string | null
  avatarUrl: string | null
}

const initialState: { error?: string; success?: string } = {}

export function AccountForms({ profile }: { profile: Profile }) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfile,
    initialState
  )
  const [avatarState, avatarAction, avatarPending] = useActionState(
    uploadAvatar,
    initialState
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-12">
      {/* Avatar */}
      <section>
        <h2 className="text-[15px] font-medium text-gray-900 mb-1">Avatar</h2>
        <p className="text-[13px] text-gray-500 mb-5">
          PNG, JPEG, or WebP. Up to 2 MB.
        </p>

        <form action={avatarAction} className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-[#EDEDED]"
            aria-label="Current avatar"
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[18px] font-medium text-gray-500">
                {(profile.displayName || profile.email || '?')
                  .slice(0, 1)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="avatar"
              name="avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="h-9 cursor-pointer file:mr-3 file:bg-[#EDEDED] file:rounded-md file:px-3 file:py-1 file:text-[12px] file:font-medium"
            />
            <Button
              type="submit"
              size="sm"
              disabled={avatarPending}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <UploadIcon className="w-3.5 h-3.5" />
              {avatarPending ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
        </form>

        {avatarState.error ? (
          <p className="text-[12px] text-red-600 mt-3">{avatarState.error}</p>
        ) : null}
        {avatarState.success ? (
          <p className="text-[12px] text-green-600 mt-3">
            {avatarState.success}
          </p>
        ) : null}
      </section>

      {/* Profile */}
      <section>
        <h2 className="text-[15px] font-medium text-gray-900 mb-1">Profile</h2>
        <p className="text-[13px] text-gray-500 mb-5">
          Your display name appears in the dashboard.
        </p>

        <form action={profileAction} className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[12px] text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email ?? ''}
              disabled
              className="h-10 bg-[#f7f7f5] text-gray-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="display_name" className="text-[12px] text-gray-700">
              Display name
            </Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              defaultValue={profile.displayName ?? ''}
              maxLength={80}
              placeholder="Your name"
              className="h-10"
            />
          </div>

          {profileState.error ? (
            <p className="text-[12px] text-red-600">{profileState.error}</p>
          ) : null}
          {profileState.success ? (
            <p className="text-[12px] text-green-600">{profileState.success}</p>
          ) : null}

          <Button
            type="submit"
            disabled={profilePending}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {profilePending ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </section>
    </div>
  )
}
