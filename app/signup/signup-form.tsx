'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GithubIcon } from 'lucide-react'
import { signInWithGitHub, signUpWithPassword } from '@/app/login/actions'

const initialState: { error?: string } = {}

export function SignupForm() {
  const [pwState, pwAction, pwPending] = useActionState(
    signUpWithPassword,
    initialState
  )
  const [oauthState, oauthAction, oauthPending] = useActionState(
    signInWithGitHub,
    initialState
  )

  return (
    <div className="space-y-4">
      <form action={oauthAction}>
        <input type="hidden" name="redirect" value="/dashboard" />
        <Button
          type="submit"
          variant="outline"
          className="w-full h-11"
          disabled={oauthPending}
        >
          <GithubIcon className="w-4 h-4" />
          Sign up with GitHub
        </Button>
        {oauthState.error ? (
          <p className="text-[12px] text-red-600 mt-2">{oauthState.error}</p>
        ) : null}
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
          or
        </span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <form action={pwAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[12px] text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[12px] text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="h-11"
          />
          <p className="text-[11px] text-gray-400">At least 8 characters.</p>
        </div>

        {pwState.error ? (
          <p className="text-[12px] text-red-600">{pwState.error}</p>
        ) : null}

        <Button
          type="submit"
          className="w-full h-11 bg-blue-500 hover:bg-blue-600"
          disabled={pwPending}
        >
          {pwPending ? 'Creating account…' : 'Create account'}
        </Button>

        <p className="text-[11px] text-gray-400 text-center">
          By creating an account you agree to receive a confirmation email.
        </p>
      </form>
    </div>
  )
}
