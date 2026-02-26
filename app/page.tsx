'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { GearSix } from '@phosphor-icons/react'
import Link from 'next/link'
import { ChatSheet } from '@/components/chat/chat-sheet'
import { LocationCard } from '@/components/cards/location-card'
import { usePilgrimStore } from '@/lib/store/pilgrim-store'
import locations from '@/data/locations.json'
import type { Location } from '@/types'

// Dynamically import 3D scene to avoid SSR issues
const KaabaScene = dynamic(
  () => import('@/components/scene/kaaba-scene').then((m) => m.KaabaScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-pilgrim-gold/30 border-t-pilgrim-gold animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-sans">Loading sacred space...</p>
        </div>
      </div>
    ),
  }
)

export default function HomePage() {
  const { sheetState, selectedLocationId, setSelectedLocation } = usePilgrimStore()
  const [selectedLocation, setSelectedLocationState] = useState<Location | null>(null)

  const sceneHeight =
    sheetState === 'full'
      ? 'h-[20vh]'
      : sheetState === 'half'
      ? 'h-[calc(45vh)]'
      : 'h-[calc(100vh-152px)]'

  const handleLocationSelect = (id: string) => {
    const loc = locations.find((l) => l.id === id) as Location | undefined
    if (loc) setSelectedLocationState(loc)
  }

  const handleCloseCard = () => {
    setSelectedLocationState(null)
    setSelectedLocation(null)
  }

  return (
    <div className="relative min-h-screen bg-[#F9F9F9]">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">
            Pilgrim
          </h1>
          <p className="text-[11px] text-muted-foreground font-sans mt-0.5">
            Masjid al-Haram · Mecca
          </p>
        </motion.div>
        <Link
          href="/settings"
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Settings"
        >
          <GearSix size={18} weight="regular" />
        </Link>
      </div>

      {/* 3D Scene */}
      <motion.div
        className={`transition-all duration-500 ease-in-out ${sceneHeight}`}
        style={{ minHeight: '150px' }}
      >
        <KaabaScene onLocationSelect={handleLocationSelect} />
      </motion.div>

      {/* Scene legend */}
      {sheetState === 'collapsed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide"
        >
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleLocationSelect(loc.id)}
              className="chip flex-shrink-0 text-xs"
            >
              {loc.name}
            </button>
          ))}
        </motion.div>
      )}

      {/* Location info card */}
      <LocationCard location={selectedLocation} onClose={handleCloseCard} />

      {/* Chat Sheet */}
      <ChatSheet />
    </div>
  )
}
