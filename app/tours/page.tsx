'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, ArrowLeft, MapPin, CaretRight, CheckCircle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import toursData from '@/data/tours.json'
import type { Tour, TourScene } from '@/types'

function TourView({
  tour,
  onBack,
}: {
  tour: Tour
  onBack: () => void
}) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const currentScene = tour.scenes[sceneIndex] as TourScene
  const progress = ((sceneIndex + 1) / tour.scenes.length) * 100

  const handleNext = () => {
    if (sceneIndex < tour.scenes.length - 1) {
      setSceneIndex((i) => i + 1)
    } else {
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label="Back to tours"
        >
          <ArrowLeft size={16} weight="bold" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Virtual Tour</p>
          <h1 className="font-sans font-semibold text-base text-foreground truncate">
            {tour.title}
          </h1>
        </div>
        <Badge variant="gold" className="text-[10px] flex-shrink-0">
          {sceneIndex + 1}/{tour.scenes.length}
        </Badge>
      </div>

      {/* Progress */}
      <div className="px-4 py-2 bg-white">
        <Progress value={progress} />
      </div>

      {/* Scene */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.28 }}
          className="flex-1 overflow-y-auto"
        >
          {/* Scene visual */}
          <div
            className="w-full h-52 flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${tour.coverColor}22 0%, ${tour.coverColor}44 100%)`,
            }}
          >
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: tour.coverColor + '33' }}
              >
                <MapPin size={32} style={{ color: tour.coverColor }} weight="fill" />
              </div>
              <p className="text-sm font-medium" style={{ color: tour.coverColor }}>
                Stop {currentScene.order}
              </p>
            </div>
            {/* Scene index dots */}
            <div className="absolute bottom-4 flex gap-1.5">
              {tour.scenes.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === sceneIndex ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-5 space-y-4">
            <div>
              <p className="exhibit-caption mb-1">Stop {currentScene.order}</p>
              <h2 className="font-sans font-semibold text-xl text-foreground">
                {currentScene.title}
              </h2>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {currentScene.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex gap-3">
        <Button
          variant="outline"
          onClick={() => setSceneIndex((i) => Math.max(0, i - 1))}
          disabled={sceneIndex === 0}
          className="flex-1"
        >
          ← Previous
        </Button>
        <Button onClick={handleNext} className="flex-1">
          {sceneIndex === tour.scenes.length - 1 ? 'Complete ✓' : 'Next →'}
        </Button>
      </div>
    </div>
  )
}

export default function ToursPage() {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [completedTours, setCompletedTours] = useState<Set<string>>(new Set())

  const handleBack = () => {
    if (selectedTour) {
      setCompletedTours((prev) => new Set(Array.from(prev).concat(selectedTour.id)))
      setSelectedTour(null)
    }
  }

  if (selectedTour) {
    return <TourView tour={selectedTour} onBack={handleBack} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Compass size={18} className="text-pilgrim-gold" weight="fill" />
          <span className="exhibit-caption">Virtual Tours</span>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Explore the Sites
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Guided virtual tours of sacred locations
        </p>
      </div>

      {/* Tour cards */}
      <div className="px-4 space-y-4 pb-6">
        {(toursData as Tour[]).map((tour, idx) => {
          const isCompleted = completedTours.has(tour.id)
          return (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <button
                className="w-full text-left overflow-hidden rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200 active:scale-[0.99]"
                onClick={() => setSelectedTour(tour)}
                aria-label={`Start ${tour.title} tour`}
              >
                {/* Tour cover */}
                <div
                  className="w-full h-28 flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${tour.coverColor}22 0%, ${tour.coverColor}55 100%)`,
                  }}
                >
                  <Compass size={36} style={{ color: tour.coverColor }} weight="fill" />
                  {isCompleted && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                      <CheckCircle size={12} weight="fill" className="text-pilgrim-green" />
                      <span className="text-[10px] font-medium text-pilgrim-green">Done</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="gold" className="text-[10px]">{tour.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {tour.stops} stops · {tour.duration}
                    </span>
                  </div>
                  <h2 className="font-sans font-semibold text-base text-foreground">
                    {tour.title}
                  </h2>
                  <p className="font-serif text-sm text-muted-foreground">{tour.arabicTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                    {tour.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {tour.highlights.slice(0, 3).map((h) => (
                      <span
                        key={h}
                        className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-muted-foreground"
                      >
                        {h}
                      </span>
                    ))}
                    {tour.highlights.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{tour.highlights.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: tour.coverColor }}>
                      {isCompleted ? 'Tour completed' : 'Start tour'}
                    </span>
                    <CaretRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
