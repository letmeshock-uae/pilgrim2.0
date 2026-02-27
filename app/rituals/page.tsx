'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, CaretRight, CheckCircle, Play, ArrowLeft } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import rituals from '@/data/rituals.json'
import type { Ritual, RitualStep } from '@/types'

function StepView({
  ritual,
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
}: {
  ritual: Ritual
  step: RitualStep
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
}) {
  const progress = ((stepIndex + 1) / totalSteps) * 100

  return (
    <motion.div
      key={stepIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
    >
      {/* Progress header */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <span className="text-xs font-medium text-pilgrim-gold">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {/* Step number badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-pilgrim-gold text-white flex items-center justify-center font-serif font-bold text-base flex-shrink-0">
            {step.number}
          </div>
          <h2 className="font-sans font-semibold text-lg text-foreground leading-tight">
            {step.title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/80 leading-relaxed">
          {step.description}
        </p>

        {/* Dua box */}
        {step.dua && (
          <div className="pilgrim-card p-4 space-y-3">
            <span className="exhibit-caption">Supplication (Dua)</span>
            <p className="text-lg text-right leading-loose font-serif text-foreground" dir="rtl">
              {step.dua}
            </p>
            <Separator />
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              &ldquo;{step.duaTranslation}&rdquo;
            </p>
            <button
              className="chip text-xs"
              onClick={() => console.log('Play dua audio')}
            >
              <Play size={11} weight="fill" />
              Listen
            </button>
          </div>
        )}

        {/* Tip box */}
        {step.tip && (
          <div className="bg-pilgrim-gold-soft border border-pilgrim-gold/20 rounded-2xl p-4">
            <p className="text-xs leading-relaxed text-pilgrim-stone">
              <span className="font-semibold text-pilgrim-gold">Guide tip: </span>
              {step.tip}
            </p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={stepIndex === 0}
          className="flex-1"
        >
          ← Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1"
        >
          {stepIndex === totalSteps - 1 ? 'Complete ✓' : 'Next →'}
        </Button>
      </div>
    </motion.div>
  )
}

export default function RitualsPage() {
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedRituals, setCompletedRituals] = useState<Set<string>>(new Set())

  const handleSelectRitual = (ritual: Ritual) => {
    setSelectedRitual(ritual)
    setCurrentStep(0)
  }

  const handleBack = () => {
    setSelectedRitual(null)
    setCurrentStep(0)
  }

  const handleNext = () => {
    if (!selectedRitual) return
    if (currentStep < selectedRitual.steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setCompletedRituals((prev) => new Set(Array.from(prev).concat(selectedRitual.id)))
      handleBack()
    }
  }

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(0, s - 1))
  }

  if (selectedRitual) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-white">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Back to rituals"
          >
            <ArrowLeft size={16} weight="bold" />
          </button>
          <div>
            <h1 className="font-sans font-semibold text-base text-foreground">
              {selectedRitual.name}
            </h1>
            <p className="font-serif text-xs text-muted-foreground">
              {selectedRitual.arabicName}
            </p>
          </div>
          <Badge variant="gold" className="ml-auto text-[10px]">
            {selectedRitual.category}
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          <StepView
            key={currentStep}
            ritual={selectedRitual}
            step={selectedRitual.steps[currentStep] as RitualStep}
            stepIndex={currentStep}
            totalSteps={selectedRitual.steps.length}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Ritual Guides"
        arabicTitle="الشعائر"
        subtitle="Step-by-step guidance with duas and tips"
      />

      {/* Ritual list */}
      <div className="px-4 space-y-3 pb-6">
        {(rituals as Ritual[]).map((ritual, idx) => {
          const isCompleted = completedRituals.has(ritual.id)
          return (
            <motion.div
              key={ritual.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <button
                className="w-full pilgrim-card p-4 text-left hover:shadow-md hover:border-gray-200 transition-all duration-200 active:scale-[0.99]"
                onClick={() => handleSelectRitual(ritual)}
                aria-label={`Open ${ritual.name} guide`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant={isCompleted ? 'green' : 'gold'} className="text-[10px]">
                        {ritual.category}
                      </Badge>
                      {isCompleted && (
                        <span className="text-[10px] text-pilgrim-green font-medium flex items-center gap-1">
                          <CheckCircle size={11} weight="fill" /> Done
                        </span>
                      )}
                    </div>
                    <h2 className="font-sans font-semibold text-base text-foreground">
                      {ritual.name}
                    </h2>
                    <p className="font-serif text-sm text-muted-foreground">
                      {ritual.arabicName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                      {ritual.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {ritual.steps.length} steps
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {ritual.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle size={16} weight="fill" className="text-pilgrim-green" />
                    ) : (
                      <CaretRight size={14} weight="bold" className="text-muted-foreground" />
                    )}
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
