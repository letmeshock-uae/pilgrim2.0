'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
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

  // CSS-driven height with smooth transition (avoids Framer Motion calc issues)
  // Pool = 100dvh - inputBar - handle - top/bottom padding (PAD * 2)
  const sceneStyle: React.CSSProperties = {
    height: `calc((100dvh - ${INPUT_H + HANDLE_H + PAD * 2}px) * ${splitRatio})`,
    transition: isDragging ? 'none' : 'height 0.55s cubic-bezier(0.34, 1.3, 0.64, 1)',
    minHeight: 96,
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden relative bg-[#F5F4F0] px-3 pt-3 pb-3">

      {/* ── Scene: gradient splash ─────────────────────────────────────────── */}
      <div
        className="relative flex-none rounded-[24px] overflow-hidden"
        style={{
          ...sceneStyle,
          background: 'radial-gradient(ellipse at 50% 45%, #13374F 0%, #0C0B19 100%)',
        }}
      >
        {/* Top-left: datum logo */}
        <div className="absolute top-5 left-5 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/datum.svg" alt="Datum" className="h-6 w-auto" />
        </div>

        {/* Top-right: Al Ain Museum logo + menu */}
        <div className="absolute top-5 right-5 z-10 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/alainmuseum.svg" alt="Al Ain Museum" className="h-8 w-auto" />
          <button
            onClick={() => setMenuOpen(true)}
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform mt-0.5"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <List size={14} weight="bold" className="text-white/80" />
          </button>
        </div>

        {/* Center: Ramadan text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none select-none">
          <p
            className="font-serif text-white leading-none tracking-wide"
            style={{ fontSize: 'clamp(28px, 8vw, 38px)', textShadow: '0 2px 24px rgba(19,55,79,0.8)' }}
          >
            Ramadan Kareem
          </p>
          <p
            className="font-serif text-white/45 leading-none tracking-[0.25em] uppercase"
            style={{ fontSize: 'clamp(10px, 3vw, 14px)' }}
          >
            Ramadan
          </p>
        </div>
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
                    /* User message — right-aligned pill */
                    <div className="flex justify-end">
                      <span className="inline-block bg-gray-100 rounded-full px-4 py-2 text-[13px] font-medium text-foreground/75 max-w-[80%] leading-snug">
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
