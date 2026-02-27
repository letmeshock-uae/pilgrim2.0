'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, Trash, X, Check } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/page-header'
import { usePilgrimStore } from '@/lib/store/pilgrim-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import remindersData from '@/data/reminders.json'

const CATEGORY_COLORS: Record<string, string> = {
  prayer: 'bg-blue-50 text-blue-700 border-blue-100',
  ritual: 'bg-pilgrim-gold-soft text-pilgrim-stone border-pilgrim-gold/20',
  hajj: 'bg-orange-50 text-orange-700 border-orange-100',
  custom: 'bg-gray-50 text-foreground border-gray-200',
}

function AddReminderSheet({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (data: { ritualId: string; label: string; time: string; category: string; enabled: boolean }) => void
}) {
  const [selectedRitual, setSelectedRitual] = useState(remindersData.ritualOptions[0])
  const [time, setTime] = useState('06:00')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ritualId: selectedRitual.id,
      label: selectedRitual.label,
      time,
      category: selectedRitual.category,
      enabled: true,
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] z-40"
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 mb-4">
        <div className="w-10 h-1 bg-gray-200 rounded-full" />
      </div>

      <div className="flex items-center justify-between px-5 mb-5">
        <h2 className="font-sans font-semibold text-base">Add Reminder</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground"
          aria-label="Close"
        >
          <X size={14} weight="bold" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-5">
        {/* Ritual select */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
            Select Ritual or Prayer
          </Label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {remindersData.ritualOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedRitual(option)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-150 text-xs font-medium ${
                  selectedRitual.id === option.id
                    ? 'border-pilgrim-gold bg-pilgrim-gold-soft text-pilgrim-stone'
                    : 'border-gray-100 bg-white text-foreground hover:border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time input */}
        <div className="space-y-2">
          <Label htmlFor="reminder-time" className="text-xs text-muted-foreground uppercase tracking-wider">
            Time
          </Label>
          <Input
            id="reminder-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="text-base"
          />
        </div>

        <Button type="submit" className="w-full">
          <Bell size={16} weight="fill" />
          Set Reminder
        </Button>
      </form>
    </motion.div>
  )
}

export default function RemindersPage() {
  const { reminders, addReminder, removeReminder, toggleReminder } = usePilgrimStore()
  const [showAdd, setShowAdd] = useState(false)

  const handleAdd = (data: { ritualId: string; label: string; time: string; category: string; enabled: boolean }) => {
    addReminder(data)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Reminders"
        arabicTitle="التذكيرات"
        subtitle="Stay on schedule during your pilgrimage"
        rightSlot={
          <Button
            onClick={() => setShowAdd(true)}
            size="sm"
            className="gap-1.5"
            aria-label="Add reminder"
          >
            <Plus size={15} weight="bold" />
            Add
          </Button>
        }
      />

      {/* Reminders list */}
      {reminders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center px-8 py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Bell size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-sans font-semibold text-base text-foreground mb-2">
            No reminders yet
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Add reminders for prayers, rituals, or important events during your pilgrimage.
          </p>
          <Button onClick={() => setShowAdd(true)}>
            <Plus size={16} weight="bold" />
            Add your first reminder
          </Button>
        </motion.div>
      ) : (
        <div className="px-4 space-y-3 pb-6">
          <AnimatePresence>
            {reminders.map((reminder, idx) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`pilgrim-card p-4 transition-opacity duration-200 ${
                  !reminder.enabled ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                          CATEGORY_COLORS[reminder.category] ?? CATEGORY_COLORS.custom
                        }`}
                      >
                        {reminder.category}
                      </span>
                    </div>
                    <p className="font-medium text-sm text-foreground truncate">
                      {reminder.label}
                    </p>
                    <p className="text-xl font-semibold text-pilgrim-gold mt-0.5 font-sans tabular-nums">
                      {reminder.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch
                      checked={reminder.enabled}
                      onCheckedChange={() => toggleReminder(reminder.id)}
                      aria-label={`Toggle ${reminder.label}`}
                    />
                    <button
                      onClick={() => removeReminder(reminder.id)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label={`Delete ${reminder.label}`}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add sheet overlay */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setShowAdd(false)}
          aria-hidden="true"
        />
      )}

      <AnimatePresence>
        {showAdd && (
          <AddReminderSheet
            onClose={() => setShowAdd(false)}
            onAdd={handleAdd}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
