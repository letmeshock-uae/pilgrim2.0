'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Headphones,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  SpeakerHigh,
  X,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import audioData from '@/data/audio.json'
import { formatTime } from '@/lib/utils'
import type { AudioGuide } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  supplication: 'bg-pilgrim-gold-soft text-pilgrim-stone',
  ritual: 'bg-pilgrim-green-soft text-pilgrim-green',
  history: 'bg-gray-100 text-foreground',
  education: 'bg-blue-50 text-blue-700',
}

function AudioPlayer({
  track,
  onClose,
}: {
  track: AudioGuide
  onClose: () => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          const next = t + 1
          if (next >= track.duration) {
            setIsPlaying(false)
            return track.duration
          }
          setProgress((next / track.duration) * 100)
          return next
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, track.duration])

  const handlePlayPause = () => {
    setIsPlaying((p) => !p)
  }

  const handleRestart = () => {
    setCurrentTime(0)
    setProgress(0)
    setIsPlaying(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] z-40 px-5 pt-5 pb-6"
    >
      {/* Handle */}
      <div className="flex justify-center mb-4">
        <div className="w-10 h-1 bg-gray-200 rounded-full" />
      </div>

      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="exhibit-caption mb-1">{track.category}</p>
          <h3 className="font-sans font-semibold text-base text-foreground leading-tight">
            {track.title}
          </h3>
          <p className="font-serif text-sm text-muted-foreground mt-0.5">
            {track.arabicTitle}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground hover:bg-gray-200 transition-colors"
          aria-label="Close player"
        >
          <X size={14} weight="bold" />
        </button>
      </div>

      {/* Track visual */}
      <div
        className="w-full h-20 rounded-2xl mb-5 flex items-center justify-center"
        style={{ backgroundColor: track.imageColor + '22', border: `1px solid ${track.imageColor}33` }}
      >
        <SpeakerHigh size={32} style={{ color: track.imageColor }} weight="fill" />
      </div>

      {/* Progress */}
      <div className="mb-4">
        <Progress value={progress} className="h-1.5" />
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
          <span className="text-xs text-muted-foreground">{track.durationFormatted}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handleRestart}
          className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Restart"
        >
          <SkipBack size={20} />
        </button>
        <button
          onClick={handlePlayPause}
          className="w-14 h-14 rounded-full bg-pilgrim-gold text-white flex items-center justify-center hover:bg-pilgrim-gold-light transition-colors shadow-md active:scale-95"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={22} weight="fill" />
          ) : (
            <Play size={22} weight="fill" />
          )}
        </button>
        <button
          onClick={() => { setCurrentTime(track.duration); setProgress(100); setIsPlaying(false) }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Skip to end"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Text / Translation */}
      {track.text && (
        <>
          <Separator className="my-4" />
          <div className="space-y-2">
            <p className="text-base text-right leading-loose font-serif" dir="rtl">{track.text}</p>
            {track.translation && (
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                &ldquo;{track.translation}&rdquo;
              </p>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}

export default function AudioPage() {
  const [selectedTrack, setSelectedTrack] = useState<AudioGuide | null>(null)

  const categories = Array.from(new Set(audioData.map((a) => a.category)))

  return (
    <div className="h-[100dvh] bg-background flex flex-col relative overflow-hidden">
      <PageHeader
        title="Audio Guides"
        arabicTitle="المقاطع الصوتية"
        subtitle="Supplications, histories, and spiritual guidance"
      />

      {/* Audio tracks */}
      <div className="flex-1 overflow-y-auto">
      <div className="px-4 space-y-3 pb-6 pt-2">
        {(audioData as AudioGuide[]).map((track, idx) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
          >
            <button
              className={`w-full pilgrim-card p-4 text-left hover:shadow-md hover:border-gray-200 transition-all duration-200 active:scale-[0.99] ${
                selectedTrack?.id === track.id ? 'border-pilgrim-gold/40 bg-pilgrim-gold-soft' : ''
              }`}
              onClick={() => setSelectedTrack(track)}
              aria-label={`Play ${track.title}`}
            >
              <div className="flex items-center gap-4">
                {/* Color icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: track.imageColor + '20' }}
                >
                  <Headphones size={20} style={{ color: track.imageColor }} weight="fill" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        CATEGORY_COLORS[track.category] ?? 'bg-gray-100 text-foreground'
                      }`}
                    >
                      {track.category}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-tight truncate">
                    {track.title}
                  </p>
                  <p className="font-serif text-xs text-muted-foreground">{track.arabicTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{track.context}</p>
                </div>

                {/* Duration + play */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">{track.durationFormatted}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: track.imageColor }}
                  >
                    <Play size={13} weight="fill" className="text-white ml-0.5" />
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      </div>{/* /scroll area */}

      {/* Player */}
      <AnimatePresence>
        {selectedTrack && (
          <AudioPlayer
            key={selectedTrack.id}
            track={selectedTrack}
            onClose={() => setSelectedTrack(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
