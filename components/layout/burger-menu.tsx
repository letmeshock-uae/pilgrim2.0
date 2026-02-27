'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  X,
  BookOpen,
  MapPin,
  Headphones,
  Compass,
  Bell,
  GearSix,
} from '@phosphor-icons/react'

const menuItems = [
  {
    href: '/rituals',
    icon: BookOpen,
    label: 'Ritual Guides',
    desc: 'Step-by-step pilgrimage rituals',
    color: '#B8962E',
  },
  {
    href: '/map',
    icon: MapPin,
    label: 'Sacred Map',
    desc: 'Explore holy locations',
    color: '#2E7D32',
  },
  {
    href: '/audio',
    icon: Headphones,
    label: 'Audio Guides',
    desc: 'Supplications & stories',
    color: '#1565C0',
  },
  {
    href: '/tours',
    icon: Compass,
    label: 'Virtual Tours',
    desc: 'Explore sites in detail',
    color: '#6A1B9A',
  },
  {
    href: '/reminders',
    icon: Bell,
    label: 'Reminders',
    desc: 'Prayer & ritual alerts',
    color: '#C62828',
  },
  {
    href: '/settings',
    icon: GearSix,
    label: 'Settings',
    desc: 'App preferences',
    color: '#37474F',
  },
]

interface BurgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-[3px] z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.9 }}
            className="absolute top-0 right-0 bottom-0 w-[82%] max-w-[320px] bg-white z-50 flex flex-col"
            style={{ boxShadow: '-12px 0 48px rgba(0,0,0,0.18)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
              <div>
                <h2 className="font-serif text-xl font-semibold text-foreground leading-tight">
                  Pilgrim
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">
                  Your sacred guide
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground hover:bg-gray-200 transition-colors active:scale-95"
                aria-label="Close menu"
              >
                <X size={15} weight="bold" />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-gray-100" />

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Main navigation">
              <div className="space-y-0.5">
                {menuItems.map(({ href, icon: Icon, label, desc, color }, idx) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + idx * 0.045, duration: 0.22 }}
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      className="flex items-center gap-3.5 px-3 py-3.5 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-active:scale-95"
                        style={{
                          backgroundColor: color + '18',
                          border: `1px solid ${color}22`,
                        }}
                      >
                        <Icon size={18} style={{ color }} weight="fill" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {label}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          {desc}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="px-5 py-5 border-t border-gray-100">
              <p className="text-center font-serif text-base text-muted-foreground">
                بسم الله الرحمن الرحيم
              </p>
              <p className="text-center text-[10px] text-muted-foreground/50 mt-1 font-sans">
                In the name of Allah, the Most Gracious
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
