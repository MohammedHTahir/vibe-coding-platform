'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'

const COOKIE_NAME = 'sb_cookie_consent'
const COOKIE_VERSION = 1
const COOKIE_MAX_AGE_DAYS = 180

export type ConsentCategories = {
  necessary: true
  preferences: boolean
  analytics: boolean
}

type StoredConsent = {
  v: number
  ts: number
  categories: ConsentCategories
}

function readConsent(): StoredConsent | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
  if (!match) return null
  try {
    const raw = decodeURIComponent(match.split('=')[1] ?? '')
    const parsed = JSON.parse(raw) as StoredConsent
    if (parsed?.v === COOKIE_VERSION && parsed.categories) return parsed
    return null
  } catch {
    return null
  }
}

function writeConsent(categories: ConsentCategories) {
  if (typeof document === 'undefined') return
  const value: StoredConsent = {
    v: COOKIE_VERSION,
    ts: Date.now(),
    categories,
  }
  const maxAge = 60 * 60 * 24 * COOKIE_MAX_AGE_DAYS
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : ''
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(value)
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [prefs, setPrefs] = useState({ preferences: true, analytics: true })

  useEffect(() => {
    setMounted(true)
    const existing = readConsent()
    if (!existing) setOpen(true)
  }, [])

  const persist = useCallback((categories: ConsentCategories) => {
    writeConsent(categories)
    setOpen(false)
    setShowDetails(false)
  }, [])

  if (!mounted || !open) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div
        className={cn(
          'mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white shadow-lg',
          'p-5 sm:p-6'
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium">
              Cookies
            </p>
            <h2 className="text-[15px] font-medium tracking-tight text-gray-900">
              We use cookies to make SprintBuild work
            </h2>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Strictly necessary cookies keep you signed in and the product
              running. With your permission we also use preference and
              analytics cookies to improve the experience. See our{' '}
              <Link
                href="/privacy"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() =>
              persist({ necessary: true, preferences: false, analytics: false })
            }
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {showDetails ? (
          <div className="mt-4 space-y-3 rounded-lg bg-[#f0f0ee] p-4">
            <CategoryRow
              id="necessary"
              title="Strictly necessary"
              description="Required for sign-in, security, and core product features."
              checked
              disabled
            />
            <CategoryRow
              id="preferences"
              title="Preferences"
              description="Remembers theme, language, and UI choices."
              checked={prefs.preferences}
              onCheckedChange={(v) =>
                setPrefs((p) => ({ ...p, preferences: v }))
              }
            />
            <CategoryRow
              id="analytics"
              title="Analytics"
              description="Aggregate usage data so we know what to improve."
              checked={prefs.analytics}
              onCheckedChange={(v) =>
                setPrefs((p) => ({ ...p, analytics: v }))
              }
            />
          </div>
        ) : null}

        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
          {showDetails ? (
            <Button
              type="button"
              variant="ghost"
              className="h-9"
              onClick={() => setShowDetails(false)}
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="h-9"
              onClick={() => setShowDetails(true)}
            >
              Customize
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            className="h-9"
            onClick={() =>
              persist({
                necessary: true,
                preferences: false,
                analytics: false,
              })
            }
          >
            Reject non-essential
          </Button>

          {showDetails ? (
            <Button
              type="button"
              className="h-9 bg-blue-500 hover:bg-blue-600"
              onClick={() =>
                persist({
                  necessary: true,
                  preferences: prefs.preferences,
                  analytics: prefs.analytics,
                })
              }
            >
              Save choices
            </Button>
          ) : (
            <Button
              type="button"
              className="h-9 bg-blue-500 hover:bg-blue-600"
              onClick={() =>
                persist({
                  necessary: true,
                  preferences: true,
                  analytics: true,
                })
              }
            >
              Accept all
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface CategoryRowProps {
  id: string
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onCheckedChange?: (value: boolean) => void
}

function CategoryRow({
  id,
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: CategoryRowProps) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={`consent-${id}`}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(v) =>
          onCheckedChange?.(v === true || v === 'indeterminate')
        }
        className="mt-0.5"
      />
      <div className="space-y-0.5">
        <Label
          htmlFor={`consent-${id}`}
          className="text-[13px] font-medium text-gray-900"
        >
          {title}
        </Label>
        <p className="text-[12px] text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
