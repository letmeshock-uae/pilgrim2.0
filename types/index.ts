export type Location = {
  id: string
  name: string
  arabicName: string
  position: number[]
  description: string
  shortDescription: string
  category: string
  tip: string
  coordinates: { lat: number; lng: number }
}

export type RitualStep = {
  number: number
  title: string
  description: string
  dua?: string
  duaTranslation?: string
  tip?: string
}

export type Ritual = {
  id: string
  name: string
  arabicName: string
  description: string
  category: string
  duration: string
  steps: RitualStep[]
}

export type AudioGuide = {
  id: string
  title: string
  arabicTitle: string
  description: string
  category: string
  duration: number
  durationFormatted: string
  text: string | null
  translation: string | null
  context: string
  imageColor: string
}

export type TourScene = {
  id: string
  title: string
  description: string
  order: number
}

export type Tour = {
  id: string
  title: string
  arabicTitle: string
  description: string
  shortDescription: string
  duration: string
  stops: number
  category: string
  coverColor: string
  highlights: string[]
  scenes: TourScene[]
}
