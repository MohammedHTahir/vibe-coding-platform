'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GithubIcon } from 'lucide-react'
import { signInWithGitHub, signUpWithPassword } from '@/app/login/actions'

const initialState: { error?: string } = {}

export function SignupForm() {
  const [accepted, setAccepted] = useState(false)
  const [showError, setShowError] = useState(false)

  const [pwState, pwAction, pwPending] = useActionState(
    signUpWithPassword,
    initialState
  )
  const [oauthState, oauthAction, oauthPending] = useActionState(
    signInWithGitHub,
    initialState
  )

  const guard = (e: React.FormEvent<HTMLFormElement>) => {
    if (!accepted) {
      e.preventDefault()
      setShowError(true)
    }
  }

  const acceptedValue = accepted ? 'true' : ''

  return (
    <div className="space-y-4">
      <form action={oauthAction} onSubmit={guard}>
        <input type="hidden" name="redirect" value="/dashboard" />
        <input type="hidden" name="terms_accepted" value={acceptedValue} />
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

      <form action={pwAction} onSubmit={guard} className="space-y-4">
        <input type="hidden" name="terms_accepted" value={acceptedValue} />
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

        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox
            id="terms_accepted"
            checked={accepted}
            onCheckedChange={(v) => {
              const next = v === true
              setAccepted(next)
              if (next) setShowError(false)
            }}
            aria-invalid={showError && !accepted ? true : undefined}
            className="mt-0.5"
          />
          <Label
            htmlFor="terms_accepted"
            className="text-[12px] text-gray-600 leading-relaxed font-normal"
          >
            I agree to the{' '}
            <Link
              href="/terms"
              target="_blank"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </Label>
        </div>

        {showError && !accepted ? (
          <p className="text-[12px] text-red-600">
            Please accept the Terms and Privacy Policy to continue.
          </p>
        ) : null}

        {pwState.error ? (
          <p className="text-[12px] text-red-600">{pwState.error}</p>
        ) : null}

        <Button
          type="submit"
          className="w-full h-11 bg-blue-500 hover:bg-blue-600"
          disabled={pwPending || !accepted}
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
