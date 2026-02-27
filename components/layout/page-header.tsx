'use client'

import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  arabicTitle?: string
  subtitle?: string
  className?: string
  rightSlot?: React.ReactNode
}

export function PageHeader({
  title,
  arabicTitle,
  subtitle,
  className,
  rightSlot,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-10',
        className
      )}
    >
      <Link
        href="/"
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-foreground hover:bg-gray-200 transition-colors active:scale-95 flex-shrink-0"
        aria-label="Back to home"
      >
        <ArrowLeft size={16} weight="bold" />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h1 className="font-sans font-semibold text-[15px] text-foreground leading-tight">
            {title}
          </h1>
          {arabicTitle && (
            <span className="font-serif text-sm text-muted-foreground">
              {arabicTitle}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
    </div>
  )
}
