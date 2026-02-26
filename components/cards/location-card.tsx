'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, BookOpen, Headphones } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Location } from '@/types'

interface LocationCardProps {
  location: Location | null
  onClose: () => void
}

export function LocationCard({ location, onClose }: LocationCardProps) {
  return (
    <AnimatePresence>
      {location && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-[calc(72px+80px+12px)] left-4 right-4 z-30 pilgrim-card p-4 shadow-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="gold" className="text-[10px]">
                  {location.category}
                </Badge>
              </div>
              <h3 className="font-semibold text-base text-foreground leading-tight">
                {location.name}
              </h3>
              <p className="font-serif text-sm text-muted-foreground mt-0.5">
                {location.arabicName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground hover:bg-gray-200 transition-colors"
              aria-label="Close location info"
            >
              <X size={14} weight="bold" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3">
            {location.description}
          </p>

          {location.tip && (
            <div className="mt-3 p-2.5 bg-pilgrim-gold-soft rounded-xl border border-pilgrim-gold/20">
              <p className="text-xs text-pilgrim-stone leading-relaxed">
                <span className="font-medium text-pilgrim-gold">Guide tip: </span>
                {location.tip}
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => console.log('Show on map', location.id)}
            >
              <MapPin size={13} />
              On Map
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => console.log('Learn about', location.id)}
            >
              <BookOpen size={13} />
              Learn
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
