'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, Compass, Info } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import locations from '@/data/locations.json'
import type { Location } from '@/types'

// Visual map — a schematic representation since we don't have real map tiles
function SchematicMap({
  locations,
  selectedId,
  onSelect,
}: {
  locations: Location[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  // Positions on a 100x100 grid
  const mapPositions: Record<string, { x: number; y: number }> = {
    kaaba: { x: 50, y: 45 },
    'hajar-al-aswad': { x: 54, y: 50 },
    zamzam: { x: 47, y: 52 },
    'safa-marwa': { x: 62, y: 40 },
    'maqam-ibrahim': { x: 46, y: 44 },
    arafat: { x: 80, y: 65 },
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-[#F5F0E8] rounded-2xl overflow-hidden border border-gray-100">
      {/* Background grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#B8962E" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Masjid al-Haram footprint */}
      <div
        className="absolute border-2 border-pilgrim-gold/40 rounded-[20%] bg-pilgrim-gold/5"
        style={{
          left: '28%', top: '22%', width: '45%', height: '55%',
        }}
      />

      {/* Kaaba representation */}
      <div
        className="absolute w-6 h-6 bg-foreground rounded-md flex items-center justify-center"
        style={{ left: 'calc(50% - 12px)', top: 'calc(45% - 12px)' }}
      >
        <div className="w-3 h-3 border border-pilgrim-gold/60 rounded-sm" />
      </div>

      {/* Location markers */}
      {locations.map((loc) => {
        const pos = mapPositions[loc.id]
        if (!pos) return null
        const isSelected = selectedId === loc.id
        return (
          <motion.button
            key={loc.id}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
            onClick={() => onSelect(loc.id)}
            whileTap={{ scale: 0.9 }}
            animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
            aria-label={`Select ${loc.name}`}
          >
            <div className="relative flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  isSelected
                    ? 'bg-pilgrim-gold border-pilgrim-gold shadow-lg scale-125'
                    : 'bg-white border-pilgrim-gold/70 hover:bg-pilgrim-gold/20'
                } transition-all duration-200`}
              />
              <div className="w-px h-2 bg-pilgrim-gold/50" />
            </div>
          </motion.button>
        )
      })}

      {/* Compass */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center">
        <Compass size={16} className="text-pilgrim-gold" />
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 text-[9px] text-muted-foreground">
        <p>Masjid al-Haram</p>
        <p className="text-pilgrim-gold">Mecca, Saudi Arabia</p>
      </div>
    </div>
  )
}

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  const handleSelect = (id: string) => {
    const loc = locations.find((l) => l.id === id) as Location | undefined
    setSelectedLocation(loc ?? null)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Sacred Map"
        arabicTitle="الخريطة"
        subtitle="Holy sites of Masjid al-Haram"
      />

      {/* Map */}
      <div className="px-4">
        <SchematicMap
          locations={locations as Location[]}
          selectedId={selectedLocation?.id ?? null}
          onSelect={handleSelect}
        />
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mx-4 mt-4 pilgrim-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="gold" className="text-[10px]">{selectedLocation.category}</Badge>
                </div>
                <h2 className="font-sans font-semibold text-base">{selectedLocation.name}</h2>
                <p className="font-serif text-sm text-muted-foreground">{selectedLocation.arabicName}</p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground"
                aria-label="Close"
              >
                <X size={12} weight="bold" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3">
              {selectedLocation.description}
            </p>
            {selectedLocation.tip && (
              <div className="mt-3 p-3 bg-pilgrim-gold-soft rounded-xl border border-pilgrim-gold/20">
                <p className="text-xs text-pilgrim-stone leading-relaxed">
                  <span className="font-medium text-pilgrim-gold">Tip: </span>
                  {selectedLocation.tip}
                </p>
              </div>
            )}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={11} />
              <span>
                {selectedLocation.coordinates.lat.toFixed(4)}°N,{' '}
                {selectedLocation.coordinates.lng.toFixed(4)}°E
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location list */}
      <div className="px-4 mt-5 pb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          All Locations
        </h2>
        <div className="space-y-2">
          {(locations as Location[]).map((loc, idx) => (
            <motion.button
              key={loc.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => handleSelect(loc.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                selectedLocation?.id === loc.id
                  ? 'border-pilgrim-gold/40 bg-pilgrim-gold-soft'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedLocation?.id === loc.id ? 'bg-pilgrim-gold' : 'bg-gray-100'
              }`}>
                <MapPin
                  size={14}
                  weight="fill"
                  className={selectedLocation?.id === loc.id ? 'text-white' : 'text-muted-foreground'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{loc.name}</p>
                <p className="text-xs text-muted-foreground truncate">{loc.shortDescription}</p>
              </div>
              <Badge variant="outline" className="text-[9px] flex-shrink-0">{loc.category}</Badge>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
