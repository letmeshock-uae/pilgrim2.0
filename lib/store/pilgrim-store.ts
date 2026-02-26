'use client'

import { create } from 'zustand'

export type ChatMessage = {
  id: string
  role: 'user' | 'ai'
  text: string
  timestamp: Date
  action?: {
    label: string
    route?: string
    locationId?: string
  } | null
}

export type Reminder = {
  id: string
  ritualId: string
  label: string
  time: string
  category: string
  enabled: boolean
  createdAt: Date
}

export type SheetState = 'collapsed' | 'half' | 'full'

interface PilgrimStore {
  // Chat state
  messages: ChatMessage[]
  isLoading: boolean
  sheetState: SheetState
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setLoading: (loading: boolean) => void
  setSheetState: (state: SheetState) => void
  clearMessages: () => void

  // 3D Scene state
  cameraTarget: [number, number, number]
  selectedLocationId: string | null
  setCameraTarget: (target: [number, number, number]) => void
  setSelectedLocation: (id: string | null) => void

  // Reminders state
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void
  removeReminder: (id: string) => void
  toggleReminder: (id: string) => void

  // Navigation
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const usePilgrimStore = create<PilgrimStore>((set) => ({
  // Chat
  messages: [],
  isLoading: false,
  sheetState: 'collapsed',
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          timestamp: new Date(),
        },
      ],
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setSheetState: (sheetState) => set({ sheetState }),
  clearMessages: () => set({ messages: [] }),

  // 3D Scene
  cameraTarget: [0, 0, 0],
  selectedLocationId: null,
  setCameraTarget: (cameraTarget) => set({ cameraTarget }),
  setSelectedLocation: (selectedLocationId) => set({ selectedLocationId }),

  // Reminders
  reminders: [],
  addReminder: (reminder) =>
    set((state) => ({
      reminders: [
        ...state.reminders,
        {
          ...reminder,
          id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          createdAt: new Date(),
        },
      ],
    })),
  removeReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.filter((r) => r.id !== id),
    })),
  toggleReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    })),

  // Navigation
  activeTab: '/',
  setActiveTab: (activeTab) => set({ activeTab }),
}))
