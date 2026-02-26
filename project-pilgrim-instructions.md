
# Project Instruction

## 1. Objective

Create a mobile application MVP called **Pilgrim** — a digital companion for pilgrims performing Hajj and Umrah.  
The application must provide spiritual guidance, navigation, educational content, and cultural storytelling through an immersive and respectful user experience.

The MVP must be fully functional, deployable on the web, and include working navigation, interactions, and states without placeholder or inactive elements.

---

## 2. Context

Pilgrim is designed for users performing Hajj and Umrah who need calm, clear, and culturally respectful guidance throughout their pilgrimage journey.

The application combines:
- Spiritual guidance
- Educational storytelling
- Ritual explanations
- Interactive 3D exploration
- AI assistant support
- Navigation and reminders

The tone of the product must be peaceful, respectful, and inspiring, with a modern and minimal design approach.

---

## 3. Scope

### In Scope
- Mobile-first responsive interface
- Interactive 3D scene of sacred locations
- AI chat assistant
- Ritual step-by-step explanations
- Interactive maps
- Audio guides
- Reminders
- Virtual tours
- Navigation between key sections
- Mock data for all content
- Fully working UI interactions

### Out of Scope
- Real backend integration
- Authentication system
- Payment system
- Real-time GPS tracking
- Real AI model integration (mock logic only)

---

## 4. User Roles & Permissions

### Primary User
Pilgrim performing Hajj or Umrah

Permissions:
- View 3D sacred locations
- Ask questions in AI chat
- Explore rituals and guides
- Listen to audio guides
- View maps
- Use reminders
- Navigate the application

No admin roles required for MVP.

---

## 5. User Flows

### Flow 1 — Explore Sacred Locations
1. User opens the app
2. Sees immersive 3D scene
3. Taps on a sacred location
4. Location info panel appears
5. User can read, listen, or explore details

### Flow 2 — Ask AI Assistant
1. User expands chat bottom sheet
2. Types a question
3. Sends message
4. AI responds with helpful guidance
5. User continues conversation

### Flow 3 — Learn Ritual Steps
1. User selects Ritual Guide
2. Sees step-by-step instructions
3. Each step includes text + optional audio
4. User navigates between steps

### Flow 4 — Use Map
1. User opens map
2. Sees sacred locations
3. Taps location
4. Sees details and directions

### Flow 5 — Set Reminder
1. User opens reminders
2. Selects ritual or event
3. Sets time
4. Reminder appears in list

---

## 6. Information Architecture

### Pages / Routes
- `/` — Home (3D Scene + Chat)
- `/rituals` — Ritual Guide
- `/map` — Interactive Map
- `/audio` — Audio Guides
- `/tours` — Virtual Tours
- `/reminders` — Reminders
- `/settings` — App Settings

### Navigation Model
- Bottom navigation bar with icons:
  - Home
  - Rituals
  - Map
  - Audio
  - Tours
  - Reminders

---

## 7. UI Specification (shadcn)

### Layout / Grid
- Mobile-first layout
- Block-based vertical structure
- Two main blocks on Home screen:
  - Top: 3D Scene
  - Bottom: Chat Assistant
- Max width: 480px
- Padding: 16px

### Components List
- Card
- Button
- Input
- Sheet (bottom sheet)
- Tabs
- Badge
- Avatar
- Scroll Area
- Separator
- Tooltip
- Dialog
- Toast

### States
All components must include:
- Default
- Hover
- Active
- Disabled
- Loading
- Empty
- Error

### Responsive Rules
- Mobile: Primary experience
- Tablet: Centered layout
- Desktop: Mobile layout centered with max width

---

## 8. Functional Requirements

### 3D Scene
- Displays interactive sacred locations
- Clickable hotspots
- Shows info panel on interaction
- Smooth transitions
- Mock 3D environment

### AI Chat Assistant
- Expandable bottom sheet
- Message input
- Send button
- User and AI message bubbles
- Mock AI responses
- Scrollable conversation
- Loading state while "AI thinking"

### Ritual Guide
- List of rituals
- Step-by-step instructions
- Progress indicator
- Optional audio playback

### Interactive Map
- Map with markers
- Clickable locations
- Info popups

### Audio Guides
- List of audio tracks
- Play / pause controls
- Progress bar

### Virtual Tours
- List of tours
- Image preview
- Description
- Start tour button

### Reminders
- Create reminder
- Select ritual
- Choose time
- List of reminders
- Delete reminder

### Settings
- Language toggle
- Theme toggle (light only for MVP)
- About section

---

## 9. Data & Mocking Plan

### Mock Entities
- SacredLocation
- Ritual
- ChatMessage
- AudioGuide
- Tour
- Reminder

### Mock API / Fixtures
Use local JSON files:
- `locations.json`
- `rituals.json`
- `chat-mock.json`
- `audio.json`
- `tours.json`
- `reminders.json`

Mock AI logic:
- Predefined responses based on keywords

---

## 10. Technical Constraints

### Stack Confirmation
- Next.js (App Router)
- TailwindCSS
- shadcn/ui
- Zustand for state
- React Hook Form + Zod
- Framer Motion for animations
- Recharts (optional)

### Performance
- Lazy loading for pages
- Optimized images
- Smooth animations

### Accessibility
- Color contrast ratio ≥ 4.5
- Focus states for all interactive elements
- ARIA labels for buttons and inputs

---

## 11. Folder Structure

```
app/
  page.tsx
  rituals/
  map/
  audio/
  tours/
  reminders/
  settings/

components/
  ui/
  layout/
  chat/
  scene/
  cards/

lib/
  store/
  utils/

data/
  locations.json
  rituals.json
  chat-mock.json
  audio.json
  tours.json
  reminders.json

styles/
  globals.css
```

---

## 12. Runbook

### Install
```
npm install
```

### Run
```
npm run dev
```

### Build
```
npm run build
```

### Deploy
Deploy to Vercel

---

## 13. Quality Criteria (Acceptance)

- All pages load without errors
- No inactive buttons
- All interactions work
- Chat responds with mock data
- 3D scene is interactive
- Navigation works
- Mobile layout is consistent
- No visual glitches
- Meets accessibility basics
- Can be deployed to Vercel successfully

---

## 14. Edge Cases & Risks

- Long chat messages overflow
- Slow device performance with 3D scene
- Large text scaling issues
- Empty states for all lists
- No internet scenario (mock data still works)

---

## 15. Open Questions

- Final list of sacred locations
- Exact ritual content and translations
- Audio guide sources
- Map data source
- Supported languages for future versions

---

## 16. Future Improvements

- Real AI integration
- Real-time navigation
- Multilingual support
- Offline mode
- Advanced 3D interactions
- Personal journey tracking
- Push notifications
- Cloud sync
- Community features
