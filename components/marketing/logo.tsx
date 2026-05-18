import { cn } from '@/lib/utils'

/**
 * The single source-of-truth path for the SprintBuild "S" monogram.
 * Used by the React components below and inlined into the icon files
 * under `app/` so the favicon, apple-icon, and OG image stay in sync.
 */
export const SPRINTBUILD_PATH =
  'M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z'

interface MarkProps {
  className?: string
  size?: number
  fill?: string
  /** Render the mark with a subtle dark→blue gradient. */
  gradient?: boolean
  /** Optional unique id suffix when multiple gradient marks share a page. */
  idSuffix?: string
}

export function SprintBuildMark({
  className,
  size = 18,
  fill = 'currentColor',
  gradient = false,
  idSuffix,
}: MarkProps) {
  const gradId = `sb-mark-${idSuffix ?? 'default'}`
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
    >
      {gradient ? (
        <defs>
          <linearGradient
            id={gradId}
            x1="0"
            y1="0"
            x2="256"
            y2="256"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#1F1F1F" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      ) : null}
      <path
        fill={gradient ? `url(#${gradId})` : fill}
        d={SPRINTBUILD_PATH}
      />
    </svg>
  )
}

interface WordmarkProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  gradient?: boolean
}

/**
 * Mark + "sprintbuild" wordmark, in Geist Mono.
 * Use anywhere we want a recognisable lock-up (login screens, footers, OG).
 */
export function SprintBuildWordmark({
  className,
  size = 'md',
  gradient = false,
}: WordmarkProps) {
  const config = {
    sm: { mark: 16, text: 'text-[12px]' },
    md: { mark: 20, text: 'text-[14px]' },
    lg: { mark: 28, text: 'text-[18px]' },
  }[size]

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <SprintBuildMark
        size={config.mark}
        fill="rgb(31, 31, 31)"
        gradient={gradient}
        idSuffix={`wordmark-${size}`}
      />
      <span
        className={cn(
          'font-mono font-semibold tracking-tight text-gray-900',
          config.text
        )}
      >
        sprintbuild
      </span>
    </span>
  )
}
