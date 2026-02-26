# Pilgrim — Hajj & Umrah Companion

A mobile-first web app providing spiritual guidance, 3D exploration, and an AI-style chat assistant for pilgrims.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** + shadcn-style components
- **Zustand** (state)
- **Framer Motion** (animations)
- **React Three Fiber** + Three.js (3D scene)
- **Phosphor Icons**

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Routes

- `/` — Home (3D scene + chat)
- `/rituals` — Ritual guide (step-by-step)
- `/map` — Interactive map (locations)
- `/audio` — Audio guides
- `/tours` — Virtual tours
- `/reminders` — Reminders
- `/settings` — Settings

## Design

- **Fonts:** Playfair Display (headings), Inter (UI/chat)
- **Cards:** 1px border `gray-100`
- **3D background:** `#F9F9F9`
- **Max width:** 480px (mobile-first)
