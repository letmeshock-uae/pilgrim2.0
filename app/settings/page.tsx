'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GearSix,
  Globe,
  Moon,
  Bell,
  Info,
  Heart,
  CaretRight,
  Star,
} from '@phosphor-icons/react'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/page-header'

type SettingRow = {
  id: string
  label: string
  description?: string
  type: 'toggle' | 'link' | 'info'
  value?: boolean
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)
  const [haptics, setHaptics] = useState(true)

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          description: 'Reminder alerts and updates',
          type: 'toggle' as const,
          value: notifications,
          onChange: setNotifications,
          icon: Bell,
        },
        {
          id: 'haptics',
          label: 'Haptic Feedback',
          description: 'Vibration on interactions',
          type: 'toggle' as const,
          value: haptics,
          onChange: setHaptics,
          icon: Star,
        },
        {
          id: 'autoplay',
          label: 'Auto-play Audio',
          description: 'Play audio when viewing guides',
          type: 'toggle' as const,
          value: autoPlay,
          onChange: setAutoPlay,
          icon: Bell,
        },
      ],
    },
    {
      title: 'Language',
      items: [
        {
          id: 'language',
          label: 'App Language',
          description: 'English (more coming soon)',
          type: 'link' as const,
          icon: Globe,
          onClick: () => console.log('Language settings'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'about',
          label: 'About Pilgrim',
          description: 'Version 1.0.0 MVP',
          type: 'link' as const,
          icon: Info,
          onClick: () => console.log('About'),
        },
        {
          id: 'privacy',
          label: 'Privacy Policy',
          type: 'link' as const,
          icon: GearSix,
          onClick: () => console.log('Privacy'),
        },
        {
          id: 'feedback',
          label: 'Send Feedback',
          description: 'Help us improve',
          type: 'link' as const,
          icon: Heart,
          onClick: () => console.log('Feedback'),
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Settings"
        arabicTitle="الإعدادات"
        subtitle="App preferences"
      />

      {/* App identity */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-6 pilgrim-card p-5 flex items-center gap-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-pilgrim-gold flex items-center justify-center flex-shrink-0">
          <span className="text-white font-serif font-bold text-2xl">P</span>
        </div>
        <div>
          <h2 className="font-serif font-semibold text-lg text-foreground">Pilgrim</h2>
          <p className="text-sm text-muted-foreground">Hajj & Umrah Companion</p>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="gold" className="text-[10px]">MVP 1.0</Badge>
            <span className="text-[10px] text-muted-foreground">English only</span>
          </div>
        </div>
      </motion.div>

      {/* Settings sections */}
      <div className="px-4 space-y-6 pb-6">
        {settingSections.map((section, sIdx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.08 }}
          >
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h2>
            <div className="pilgrim-card overflow-hidden">
              {section.items.map((item, iIdx) => {
                const Icon = item.icon
                const isLast = iIdx === section.items.length - 1
                return (
                  <div key={item.id}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 ${
                        item.type === 'link'
                          ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors'
                          : ''
                      }`}
                      onClick={item.type === 'link' ? (item as { onClick?: () => void }).onClick : undefined}
                      role={item.type === 'link' ? 'button' : undefined}
                      tabIndex={item.type === 'link' ? 0 : undefined}
                      onKeyDown={
                        item.type === 'link'
                          ? (e) => {
                              if (e.key === 'Enter') (item as { onClick?: () => void }).onClick?.()
                            }
                          : undefined
                      }
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon size={15} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        )}
                      </div>
                      {item.type === 'toggle' && (
                        <Switch
                          checked={(item as { value?: boolean }).value}
                          onCheckedChange={(item as { onChange?: (v: boolean) => void }).onChange}
                          aria-label={item.label}
                        />
                      )}
                      {item.type === 'link' && (
                        <CaretRight size={14} className="text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                    {!isLast && <Separator />}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}

        {/* Tagline */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Made with care for pilgrims worldwide
          </p>
          <p className="text-xs text-pilgrim-gold mt-1">بسم الله الرحمن الرحيم</p>
        </div>
      </div>
    </div>
  )
}
