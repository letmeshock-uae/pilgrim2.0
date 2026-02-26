# Pilgrim Look & Feel Guide (for VibeCoding in Cursor / Antigravity)

This document converts the abstract direction into an implementation-ready **Look & Feel guide** for **Pilgrim**, optimized for code generation workflows (Cursor / Antigravity).  
Use it as a “design contract”: principles, rules, component behavior, accessibility, and tokens.

---

## 0) What this style is

**Pilgrim** = a *light, museum-like guide*: clean, calm, content-first, with carefully placed accents and an occasional editorial / book-typography touch (serif) — without techno-cold vibes.

**Goal:** users with varied digital experience feel **safe**, **guided**, and **confident**.

---

## 1) Principles (how to decide)

1. **Content-first:** meaning first, decoration second.  
2. **Clean + airy:** white backgrounds, generous spacing, minimal noise.  
3. **Accents only when appropriate:** never “design for design’s sake.”  
4. **Clear contrast:** readability > aesthetics.  
5. **Tactile simplicity:** large tap targets, obvious states.  
6. **Block rhythm:** modular sections + horizontal/vertical variation + different block “weights.”  
7. **Museum tone:** captions, “exhibit cards,” curator-like notes.  
8. **3D as an accent:** the 3D scene should not turn everything into an attraction.

---

## 2) Layout: block system + composition

### 2.1 Foundation
- A page is a **sequence of blocks (sections)**; each block is a complete meaning unit.
- Default structure: `Header / Hero / Content Blocks / CTA / Footer`.
- Inside blocks: **cards**, **lists**, **captions**, **media**, **interactive elements**.

### 2.2 Rhythm: mix horizontal + vertical
Alternate:
- Vertical “lanes” (text, steps, FAQ)
- Horizontal “shelves” (exhibit cards, galleries, features)

Rule: **no more than one “complex” block per viewport**  
(complex = lots of interaction / heavy visuals).

### 2.3 Blocks of different mass (weight contrast)
Define 3 block weights:
- **Light:** thin cards / side notes / captions  
- **Medium:** primary content (text + media)  
- **Heavy:** hero / key CTA / 3D scene / large exhibit card

Composition rule: **Heavy blocks are rare**; place **2–4 Light/Medium blocks** between Heavy ones.

### 2.4 Grid + spacing (implementation-friendly)
- Container: `max-width: 1120–1280px`
- Side padding: 24–32 (mobile), 40–64 (desktop)
- Section vertical spacing: 48–96 (based on block weight)

---

## 3) Typography: neutral Sans + editorial accent

### 3.1 Font roles
- **Base Sans (neutral grotesk):** all UI, buttons, navigation, forms, helper text
- **Accent Serif (editorial / book vibe):** H1–H2, quotes, “exhibit” captions

### 3.2 Usage rules
- Serif is an **accent**, not the default.
- For large text volumes:
  - increase **line-height**
  - add **paragraph spacing**
  - insert **subheads + callouts** to avoid “walls of text”

### 3.3 Suggested scale (easy to implement)
- Body: 16–18px, line-height 1.55–1.75  
- Small: 13–14px, line-height 1.4–1.6  
- H1: 40–56px (responsive), line-height 1.05–1.15  
- H2: 28–36px, line-height 1.15–1.25  
- H3: 20–24px, line-height 1.2–1.35  
- Caption/Label: 12–13px, slightly increased letter-spacing (museum-like labels)

### 3.4 “Add air” to text
- Above-average line-height
- Clear paragraph separation
- Use lists and callout cards freely

---

## 4) Color: white surfaces + light theme + one controlled accent

### 4.1 Philosophy
- Primary background: **white / near-white**
- Dividers/borders: **soft**, never harsh
- One primary **accent color** + its states (soft/dark)
- Avoid excessive gradients (Pilgrim = mostly flat, calm surfaces)

### 4.2 UI rules
- Text must remain high-contrast.
- Accent is used for:
  - primary CTA
  - active navigation item
  - progress/highlights
  - hover/focus states
  - curator-like tags (“Guide tip”, “Important”)

---

## 5) Accessibility: clear contrast + touch-friendly

### 5.1 Contrast + states
Every interactive element must have:
- `default / hover / pressed / disabled / focus`

Focus is mandatory and **visible** (no hidden outline).

### 5.2 Touch targets
- Minimum tap target: **44×44**
- Adequate spacing between interactive items to prevent mis-taps
- Forms: big fields, clear labels, clear error messages

### 5.3 “Non-scary accents”
- Errors must explain what to do next
- Warnings should be soft but noticeable
- Prefer “helpful guidance” over aggressive red screens

---

## 6) Character: clean + museum-like + caring guide

### 6.1 UI as a guided tour
The “guide” shows up through:
- help text near actions
- short explanations
- step/progress indicators
- “what happens next” cues

### 6.2 Museum patterns (concrete)
- **Captions** under media: date / place / context
- **Exhibit card:** visual + title + a short “curator” line
- **Callouts:** “Tip”, “Context”, “Why it matters”

---

## 7) Visuals: 3D scene + accents + illustration/icons

### 7.1 Role of the 3D scene
- 3D is an **explanatory tool** or a **rare wow accent**
- Surround 3D with air and simple UI to avoid cognitive overload

### 7.2 Accent elements
Use sparingly:
- markers
- tags/badges
- thin lines
- micro-animations (very soft)

### 7.3 Icons/illustrations
- Icons: simple, readable, not “futuristic tiny”
- Illustrations: support the content, never distract

---

## 8) Language: natural, non-technical, caring

### 8.1 Tone
- Simple words, short sentences
- No jargon / no “validation error”
- Prefer: “Check your email — it looks like the `@` is missing.”

### 8.2 Microcopy templates
- CTAs: “Continue”, “Show”, “Save”, “Back”, “Got it”
- Hints: “Here’s what this means…”, “If you’re not sure, choose…”
- Errors: “Couldn’t upload. Try again or pick another file.”

---

## 9) Component rules (so Cursor/Antigravity builds it right)

### 9.1 Buttons
- Primary: accent, large, simple
- Secondary: neutral, calm
- Tertiary: text button with clear hover/focus

### 9.2 Cards (the core Pilgrim unit)
- White surface, soft border, minimal shadow (or none)
- Strict vertical structure: `title → description → meta → action`
- Hover: slight lift or border emphasis (very subtle)

### 9.3 Forms
- Labels always visible
- Errors attached to the field + short explanation
- Steps/progress = “guide” pattern

### 9.4 Navigation
- Simple, not overloaded
- Active item visible but not loud
- Mobile: big, tap-friendly items

---

## 10) Tokens (drop into a spec / generator input)

Use as a “design contract” and swap `BRAND_ACCENT` with your project’s accent.

```json
{
  "theme": "pilgrim_light",
  "color": {
    "bg": "#FFFFFF",
    "surface": "#FFFFFF",
    "text": "#111111",
    "mutedText": "#4B5563",
    "border": "rgba(17,17,17,0.10)",
    "accent": "BRAND_ACCENT",
    "accentSoft": "BRAND_ACCENT_SOFT",
    "focusRing": "BRAND_ACCENT"
  },
  "radius": { "sm": 10, "md": 14, "lg": 18 },
  "shadow": {
    "card": "subtle (or none)",
    "floating": "soft"
  },
  "spacing": {
    "sectionY": { "mobile": 56, "desktop": 88 },
    "cardPadding": { "mobile": 16, "desktop": 20 },
    "gap": { "sm": 8, "md": 12, "lg": 20 }
  },
  "typography": {
    "base": { "family": "Neutral Sans", "body": 16, "lineHeight": 1.65 },
    "accent": { "family": "Book Serif", "use": ["H1","H2","quotes","exhibitCaptions"] }
  },
  "accessibility": {
    "minTap": 44,
    "focusVisible": true,
    "contrast": "high"
  }
}
```

---

## 11) Do / Don’t (hard rules)

### Do
- Build pages from blocks with a clear hierarchy
- Add air to text and forms
- Use 3D as a rare, meaningful accent
- Caption content “museum-style”
- Provide full interactive states + helpful guidance

### Don’t
- Don’t turn the UI into a techno dashboard
- Don’t sprinkle gradients everywhere
- Don’t create tiny tap targets
- Don’t overuse serif (accent only)
- Don’t use the accent color everywhere

---

## 12) Teller adaptation rule

For **Teller**, keep the Pilgrim framework, but adapt:
- accent + character to the audience/project
- the level of “museum tone”
- the share of graphics/3D
- language can become more formal or more empathetic depending on the context
