'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { PaperPlaneTilt, Spinner, CaretDown, Sparkle } from '@phosphor-icons/react'
import { usePilgrimStore, type SheetState } from '@/lib/store/pilgrim-store'
import { usePilgrimAi } from '@/hooks/use-pilgrim-ai'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import chatMock from '@/data/chat-mock.json'

const SHEET_HEIGHTS: Record<SheetState, string> = {
  collapsed: '80px',
  half: '55vh',
  full: '88vh',
}

function MessageBubble({
  role,
  text,
  action,
}: {
  role: 'user' | 'ai'
  text: string
  action?: { label: string; route?: string } | null
}) {
  const isUser = role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex gap-2.5', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-pilgrim-gold-soft border border-pilgrim-gold/20 flex items-center justify-center mt-0.5">
          <Sparkle size={13} weight="fill" className="text-pilgrim-gold" />
        </div>
      )}
      <div className={cn('max-w-[78%] space-y-2')}>
        <div
          className={cn(
            'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-pilgrim-gold text-white rounded-tr-sm'
              : 'bg-gray-50 border border-gray-100 text-foreground rounded-tl-sm'
          )}
        >
          {text}
        </div>
        {action && !isUser && (
          <button
            className="chip text-xs"
            onClick={() => console.log('Navigate to', action.route)}
          >
            {action.label} →
          </button>
        )}
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex gap-2.5 items-end"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-pilgrim-gold-soft border border-pilgrim-gold/20 flex items-center justify-center">
        <Sparkle size={13} weight="fill" className="text-pilgrim-gold" />
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center">
          {[0, 0.2, 0.4].map((delay) => (
            <motion.div
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 0.8, repeat: Infinity, delay }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function ChatSheet() {
  const { messages, isLoading, sheetState, setSheetState } = usePilgrimStore()
  const { sendMessage, sendGreeting } = usePilgrimAi()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasGreeted = useRef(false)

  // Send greeting on first open
  useEffect(() => {
    if (!hasGreeted.current && messages.length === 0) {
      hasGreeted.current = true
      setTimeout(sendGreeting, 600)
    }
  }, [sendGreeting, messages.length])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return
    setInputValue('')
    await sendMessage(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y
    const offset = info.offset.y

    if (offset < -60 || velocity < -300) {
      setSheetState(sheetState === 'collapsed' ? 'half' : 'full')
    } else if (offset > 60 || velocity > 300) {
      setSheetState(sheetState === 'full' ? 'half' : 'collapsed')
    }
  }

  const handleChipClick = (text: string) => {
    if (sheetState === 'collapsed') setSheetState('half')
    sendMessage(text)
  }

  const isExpanded = sheetState !== 'collapsed'

  return (
    <motion.div
      className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] z-40"
      animate={{ height: SHEET_HEIGHTS[sheetState] }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      style={{ overflow: 'hidden' }}
    >
      {/* Drag handle area */}
      <motion.div
        className="cursor-grab active:cursor-grabbing pt-3 pb-2 flex flex-col items-center gap-2"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (sheetState === 'collapsed') setSheetState('half')
        }}
      >
        <div className="w-10 h-1 rounded-full bg-gray-200" />

        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-pilgrim-gold-soft border border-pilgrim-gold/20 flex items-center justify-center">
              <Sparkle size={11} weight="fill" className="text-pilgrim-gold" />
            </div>
            <span className="text-sm font-medium text-foreground">Pilgrim Guide</span>
          </div>
          {isExpanded && (
            <button
              className="text-muted-foreground hover:text-foreground p-1 -mr-1"
              onClick={(e) => {
                e.stopPropagation()
                setSheetState('collapsed')
              }}
              aria-label="Collapse chat"
            >
              <CaretDown size={16} weight="bold" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Messages area */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[calc(100%-120px)]"
          >
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3 pb-3">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} {...msg} />
                ))}
                <AnimatePresence>
                  {isLoading && <TypingIndicator />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Suggestion chips (shown when few messages) */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {chatMock.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      className="chip flex-shrink-0"
                      onClick={() => handleChipClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-2 bg-white border-t border-gray-50">
        <div className="flex gap-2 items-center">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (sheetState === 'collapsed') setSheetState('half')
            }}
            placeholder="Ask your guide..."
            className="flex-1 h-11 bg-gray-50 border-gray-100 rounded-xl text-sm"
            aria-label="Chat input"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="flex-shrink-0 h-11 w-11"
            aria-label="Send message"
          >
            {isLoading ? (
              <Spinner size={18} className="animate-spin" />
            ) : (
              <PaperPlaneTilt size={18} weight="fill" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
