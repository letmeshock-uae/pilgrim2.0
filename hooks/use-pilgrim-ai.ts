'use client'

import { useCallback } from 'react'
import { usePilgrimStore } from '@/lib/store/pilgrim-store'
import chatMock from '@/data/chat-mock.json'

export function usePilgrimAi() {
  const { addMessage, setLoading } = usePilgrimStore()

  const sendMessage = useCallback(async (text: string) => {
    // Add user message
    addMessage({ role: 'user', text })

    // Show loading state
    setLoading(true)

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 600))

    // Find matching response
    const lowerText = text.toLowerCase()
    const match = chatMock.responses.find((r) =>
      r.keywords.some((kw) => lowerText.includes(kw))
    )

    const response = match
      ? { text: match.response, action: match.action ?? null }
      : { text: chatMock.fallback, action: null }

    setLoading(false)
    addMessage({ role: 'ai', text: response.text, action: response.action })
  }, [addMessage, setLoading])

  const sendGreeting = useCallback(() => {
    addMessage({ role: 'ai', text: chatMock.greeting, action: null })
  }, [addMessage])

  return { sendMessage, sendGreeting }
}
