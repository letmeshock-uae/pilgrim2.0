
# ARCHITECTURE

## 1. System Boundaries
- **Inside:** Next.js Frontend, R3F Scene, Zustand Local Store, Mock API logic.
- **Outside:** Future LLM API (OpenAI/Anthropic), Asset CDN for 3D models.

## 2. Architecture Style
**Feature-Sliced Modular Design.**
- `components/canvas`: Encapsulated 3D logic.
- `components/chat`: UI-heavy chat and animation logic.
- `hooks/use-pilgrim-ai`: Custom hook to manage prompt-response cycles.

## 3. Rendering Policy
- **Client-Side First:** Since the app relies on WebGL (Three.js) and Framer Motion, 90% of the main view is Client-rendered.
- **Static Metadata:** Used for SEO and initial page shell to ensure fast LCP (Largest Contentful Paint).

## 4. State Management Strategy (Zustand)
- One central store `usePilgrimStore` to handle:
  - `isExpanded`: boolean (Chat sheet state)
  - `cameraTarget`: Vector3 (Where the 3D camera is looking)
  - `messages`: array (Chat history)

## 5. Non-Functional Requirements
- **Performance:** 3D scene must maintain 60FPS on mobile.
- **Vibe:** Transitions between chat states must be elastic and "soft".
