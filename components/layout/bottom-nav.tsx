'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  House,
  BookOpen,
  MapPin,
  Headphones,
  Compass,
  Bell,
} from '@phosphor-icons/react'

const navItems = [
  { href: '/', icon: House, label: 'Home' },
  { href: '/rituals', icon: BookOpen, label: 'Rituals' },
  { href: '/map', icon: MapPin, label: 'Map' },
  { href: '/audio', icon: Headphones, label: 'Audio' },
  { href: '/tours', icon: Compass, label: 'Tours' },
  { href: '/reminders', icon: Bell, label: 'Reminders' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 safe-area-bottom"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-2 py-1.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-pilgrim-gold'
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
              )}
            >
              <Icon
                size={22}
                weight={isActive ? 'fill' : 'regular'}
                aria-hidden="true"
              />
              <span className={cn(
                'text-[10px] font-medium leading-none',
                isActive ? 'text-pilgrim-gold' : 'text-muted-foreground'
              )}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-pilgrim-gold" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
