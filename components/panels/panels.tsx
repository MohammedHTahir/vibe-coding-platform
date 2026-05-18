import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  children: ReactNode
}

export function Panel({ className, children }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col relative w-full h-full rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  )
}

export function PanelHeader({ className, children }: Props) {
  return (
    <div
      className={cn(
        'text-[12px] flex items-center border-b border-border/40 px-3 py-2 text-muted-foreground bg-secondary/30',
        className
      )}
    >
      {children}
    </div>
  )
}
