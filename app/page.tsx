'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { List, Waveform, PaperPlaneTilt, Sparkle } from '@phosphor-icons/react'
import { BurgerMenu } from '@/components/layout/burger-menu'
import { EditorialText } from '@/components/chat/editorial-text'
import { usePilgrimStore } from '@/lib/store/pilgrim-store'
import { usePilgrimAi } from '@/hooks/use-pilgrim-ai'
import chatMock from '@/data/chat-mock.json'

// ─── Constants ────────────────────────────────────────────────────────────────
const INPUT_H = 84   // px — input bar height
const HANDLE_H = 28  // px — drag handle zone height
const PAD = 12       // px — outer container padding (top + bottom = 24px)
const RATIO_DEFAULT = 0.68  // scene fraction of available space
const RATIO_CHAT = 0.36     // scene fraction when conversation is active
const RATIO_MIN = 0.16
const RATIO_MAX = 0.86

// ─── Quick actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    id: 'journey',
    label: 'Start journey',
    desc: 'to a holy place',
    message: 'Tell me about starting the Hajj pilgrimage journey to Mecca',
  },
  {
    id: 'explore',
    label: 'Look around',
    desc: 'on your own',
    message: null,
  },
  {
    id: 'ask',
    label: 'Ask anything',
    desc: 'or find out why',
    message: null,
  },
]

// ─── Dynamic 3D scene ─────────────────────────────────────────────────────────
const KaabaScene = dynamic(
  () => import('@/components/scene/kaaba-scene').then((m) => m.KaabaScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#1C1C1E] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
      </div>
    ),
  }
)

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2">
      {[0, 0.18, 0.36].map((delay) => (
        <motion.div
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 0.75, repeat: Infinity, delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { messages, isLoading } = usePilgrimStore()
  const { sendMessage } = usePilgrimAi()

  const [menuOpen, setMenuOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [splitRatio, setSplitRatio] = useState(RATIO_DEFAULT)
  const [isDragging, setIsDragging] = useState(false)

  const splitRatioRef = useRef(RATIO_DEFAULT)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasMessages = messages.length > 0

  // Auto-resize scene when conversation starts
  useEffect(() => {
    if (hasMessages && splitRatioRef.current > RATIO_CHAT + 0.04) {
      splitRatioRef.current = RATIO_CHAT
      setSplitRatio(RATIO_CHAT)
    }
  }, [hasMessages])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // ── Drag handle ────────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(true)

      const startY = e.clientY
      const startRatio = splitRatioRef.current
      const totalH = window.innerHeight - INPUT_H - HANDLE_H - PAD * 2

      const onMove = (me: PointerEvent) => {
        const dy = me.clientY - startY
        const next = Math.min(RATIO_MAX, Math.max(RATIO_MIN, startRatio + dy / totalH))
        splitRatioRef.current = next
        setSplitRatio(next)
      }

      const onUp = () => {
        setIsDragging(false)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }

      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerup', onUp)
    },
    []
  )

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = inputValue.trim()
    if (!text || isLoading) return
    setInputValue('')
    await sendMessage(text)
  }, [inputValue, isLoading, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Quick action ───────────────────────────────────────────────────────────
  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[number]) => {
    if (action.message) {
      sendMessage(action.message)
    } else if (action.id === 'ask') {
      inputRef.current?.focus()
    } else {
      console.log('explore mode')
    }
  }

  // CSS-driven height with smooth transition (avoids Framer Motion calc issues)
  // Pool = 100dvh - inputBar - handle - top/bottom padding (PAD * 2)
  const sceneStyle: React.CSSProperties = {
    height: `calc((100dvh - ${INPUT_H + HANDLE_H + PAD * 2}px) * ${splitRatio})`,
    transition: isDragging ? 'none' : 'height 0.55s cubic-bezier(0.34, 1.3, 0.64, 1)',
    minHeight: 96,
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden relative bg-[#F5F4F0] px-3 pt-3 pb-3">

      {/* ── 3D Scene ───────────────────────────────────────────────────────── */}
      <div
        className="relative flex-none bg-[#1C1C1E] rounded-[24px] overflow-hidden"
        style={sceneStyle}
      >
        <KaabaScene onLocationSelect={() => {}} />

        {/* Top-left: title */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <p className="font-serif text-white text-[17px] font-semibold drop-shadow">
            Pilgrim
          </p>
          <p className="text-white/45 text-[10px] font-sans mt-0.5">
            Masjid al-Haram · Mecca
          </p>
        </div>

        {/* Top-right: burger button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 right-4 w-11 h-11 bg-white rounded-[16px] flex items-center justify-center z-10 active:scale-95 transition-transform"
          style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.28)' }}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
        >
          <List size={18} weight="bold" className="text-foreground" />
        </button>

        {/* Bottom: quick action cards (disappear once chat starts) */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute bottom-4 left-4 right-4 flex gap-2"
            >
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="flex-1 bg-white/90 backdrop-blur-md rounded-[18px] p-3 text-left transition-all active:scale-[0.96] active:bg-white/75"
                >
                  <p className="text-[12px] font-semibold text-foreground leading-tight">
                    {action.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                    {action.desc}
                  </p>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Drag handle ────────────────────────────────────────────────────── */}
      <div
        style={{ height: HANDLE_H }}
        className="flex-none flex justify-center items-center cursor-row-resize select-none touch-none"
        onPointerDown={handleDragStart}
        aria-label="Drag to resize"
        role="separator"
        aria-orientation="horizontal"
      >
        <div className="w-9 h-[5px] rounded-full bg-gray-300" />
      </div>

      {/* ── Bottom card: messages + input bar ─────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 rounded-[24px] overflow-hidden bg-white">

        {/* Content: messages or empty state */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {hasMessages ? (
            <div className="px-5 pt-5 pb-6 space-y-8">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === 'user' ? (
                    /* User message — centered pill */
                    <div className="flex justify-center">
                      <span className="inline-block bg-gray-100 rounded-full px-4 py-2 text-[13px] font-medium text-foreground/75 text-center max-w-[90%] leading-snug">
                        {msg.text}
                      </span>
                    </div>
                  ) : (
                    /* AI response — editorial text with gold highlights */
                    <div className="space-y-3">
                      <EditorialText text={msg.text} />
                      {msg.action && (
                        <button
                          className="chip text-[12px]"
                          onClick={() => console.log('Navigate to', msg.action?.route)}
                        >
                          {msg.action.label} →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && <TypingDots />}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            /* Empty / welcome state */
            <div className="h-full flex flex-col items-center justify-center px-8 py-4 text-center">
              <div className="w-10 h-10 rounded-full bg-pilgrim-gold-soft border border-pilgrim-gold/25 flex items-center justify-center mb-3">
                <Sparkle size={17} weight="fill" className="text-pilgrim-gold" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ask anything about the sacred sites, rituals, or history of Hajj and Umrah
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {chatMock.suggestions.map((s) => (
                  <button key={s} className="chip text-[11px]" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div
          style={{ height: INPUT_H }}
          className="flex-none bg-white border-t border-gray-100 px-4 flex flex-col justify-center gap-1.5"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything"
                aria-label="Ask a question about Hajj or Umrah"
                disabled={isLoading}
                className="w-full h-12 pl-4 pr-12 bg-gray-100 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground/55 focus:outline-none focus:ring-2 focus:ring-pilgrim-gold/20 disabled:opacity-60 transition-all"
              />
              {/* Action icon inside input */}
              <button
                onClick={inputValue.trim() ? handleSend : () => console.log('voice')}
                aria-label={inputValue.trim() ? 'Send' : 'Voice input'}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
                style={{ backgroundColor: inputValue.trim() ? '#B8962E' : 'transparent' }}
              >
                {inputValue.trim() ? (
                  <PaperPlaneTilt size={14} weight="fill" className="text-white" />
                ) : (
                  <Waveform size={16} className="text-muted-foreground/60" />
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/35 font-sans leading-none">
            Powered by Pilgrim
          </p>
        </div>

      </div>{/* /bottom card */}

      {/* ── Burger menu (absolute, within page bounds) ─────────────────────── */}
      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
