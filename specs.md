
# SPEC — Pilgrim MVP

## 1. Objective
Build **Pilgrim**, a digital companion for Hajj and Umrah. The app provides visual 3D guidance and an empathetic AI assistant to simplify rituals and provide historical context through a "Digital Museum" aesthetic.

## 2. Context
Mobile-first web application designed for high-stress, high-crowd environments. The UX must be calm, minimalist, and highly readable under direct sunlight.

## 3. Tech Stack
- **Framework:** Next.js 16 (App Router)
- **3D Engine:** React Three Fiber (Three.js)
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS (Custom Serif/Sans mix)
- **Components:** shadcn/ui
- **Icons:** @phosphor-icons/react
- **State:** Zustand (Shared state between 3D and Chat)

## 4. User Roles
| Role | Permissions |
| :--- | :--- |
| **Pilgrim (User)** | Interactive 3D exploration, AI Chat, Ritual progress. |
| **Admin** | Manage POI (Point of Interest) coordinates and AI knowledge. |

## 5. Core Entities
### Location (POI)
| Field | Type | Description |
| :--- | :--- | :--- |
| id | string | Unique ID |
| name | string | e.g., "Hajar al-Aswad" |
| position | number[] | [x, y, z] for 3D camera targeting |

### Message
| Field | Type | Description |
| :--- | :--- | :--- |
| role | 'user' | 'ai' | Message sender |
| text | string | Content (Supports Markdown) |
| action | object | Optional: { label: string, targetCoord: number[] } |

## 6. Scope
- **In Scope:** Immersive 3D Kaaba scene, Expandable Bottom-Sheet Chat, Suggestion Chips, Typography-first UI.
- **Out of Scope:** User Auth (Phase 1), Real-time GPS, Multi-language (English only for MVP).

## 7. User Flows
1. **The Welcome:** User enters -> 3D scene fades in with auto-rotate -> AI sends a greeting.
2. **Interactive Guide:** User asks "Where is Safa?" -> AI responds -> 3D camera moves to Safa -> User clicks "Done".

## 8. Information Architecture
- `/` : Primary viewport (Canvas + Sheet).
- `/guides` : Static library of spiritual readings.

## 9. UI Specification
- **Layout:** Vertical Split (60% 3D / 40% Chat).
- **Typography:** Serif (Headings), Sans-Serif (Functional text).
- **Rounding:** All containers use `rounded-t-[32px]` or `rounded-2xl`.

## 10. Data & Mocking Plan
- Mock LLM responses with a 1s delay to simulate "Thinking" state.
- Hardcoded 3D coordinates for key POIs in the Masjid al-Haram.

## 11. Acceptance Criteria
- 3D Scene remains visible when Chat is expanded to "Half" state.
- All "Suggestion Chips" trigger a UI response.
- Font sizes are minimum 16px for readability.
