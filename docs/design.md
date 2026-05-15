---
version: alpha
name: Nuru
description: A dark-mode-first design system for an AI teaching platform built for low-resource classrooms — cinematic, warm, and built to make education feel like a beam of light.
colors:
  background: "#0B1929"
  surface: "#152339"
  surface-elevated: "#1E3050"
  primary: "#F59E0B"
  on-primary: "#0B1929"
  on-background: "#E8DDD0"
  on-surface: "#C8BEAF"
  secondary-text: "#7A8FA8"
  border: "#243652"
  success: "#34D399"
  error: "#F87171"
  warning: "#FBBF24"
  info: "#60A5FA"
  background-light: "#F7F3EE"
  surface-light: "#FFFFFF"
  surface-elevated-light: "#F0EBE2"
  on-background-light: "#0B1929"
  on-surface-light: "#1E3050"
  secondary-text-light: "#6B7FA8"
  border-light: "#E2D9CE"
  orb-from: "#F59E0B"
  orb-to: "#06B6D4"

typography:
  display:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h1:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  h2:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
  h3:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6

rounded:
  none: "0px"
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"

spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "48px"
  8: "64px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    fontWeight: 600
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#FBBF24"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    fontWeight: 600
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-primary-disabled:
    backgroundColor: "{colors.border}"
    textColor: "{colors.secondary-text}"
    typography: "{typography.body}"
    fontWeight: 600
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    fontWeight: 600
    rounded: "{rounded.full}"
    padding: "11px 23px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-background}"
    typography: "{typography.body}"
    fontWeight: 500
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.5}"
  card-glass:
    backgroundColor: "rgba(255, 255, 255, 0.06)"
    textColor: "{colors.on-background}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "{spacing.5}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-background}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
  input-focus:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-background}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
  chip:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-surface}"
    typography: "{typography.caption}"
    fontWeight: 500
    rounded: "{rounded.full}"
    padding: "6px 14px"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    fontWeight: 600
    rounded: "{rounded.full}"
    padding: "6px 14px"
  message-student:
    backgroundColor: "#1A3A5C"
    textColor: "{colors.on-background}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.4}"
  message-agent:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.4}"
  voice-orb:
    backgroundColor: "linear-gradient(135deg, {colors.orb-from}, {colors.orb-to})"
    rounded: "{rounded.full}"
    size: "120px"
  nav-bar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.secondary-text}"
    typography: "{typography.caption}"
    height: "64px"
    padding: "0 24px"
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    fontWeight: 700
    rounded: "{rounded.full}"
    size: "20px"
---

# Nuru Design System

## Overview

Nuru means *light* in Swahili — and the design embodies that literally. The primary surface is deep navy (`#0B1929`), representing the darkness of educational inequality. Warm cream text and amber actions are the beam of light cutting through it. This is a dark-mode-first system with a warm-cream light mode available for high-brightness outdoor contexts common on low-end Android devices in East Africa. The emotional target is **cinematic and aspirational without being cold**, **warm and human without being childish**. Nuru must never look like a government portal, a sterile SaaS dashboard, a gamified kids app, or a corporate productivity tool. It looks like something worth using — something that respects the teacher who built it and the student who needs it.

## Colors

The dark palette anchors on `background` (`#0B1929`), a near-midnight navy derived from the "ray of hope" reference — the darkness that makes the light meaningful. `surface` (`#152339`) lifts cards off the background just enough to create hierarchy without breaking the cinematic atmosphere. `on-background` (`#E8DDD0`) is warm cream, not pure white — it reads as the pencil's light beam, intentionally warm and human. `primary` (`#F59E0B`) is amber: it carries African warmth, creates urgency without aggression, and stands out sharply on navy (contrast ratio ~7.8:1 — WCAG AAA). Semantic states use clear, saturated values: `success` green (`#34D399`), `error` red (`#F87171`), `warning` amber-adjacent (`#FBBF24`), `info` sky blue (`#60A5FA`). The light mode swaps `background-light` (`#F7F3EE`, warm cream) and `on-background-light` (`#0B1929`, navy text) — inverting the metaphor so the page itself becomes the light. `card-glass` uses `rgba(255,255,255,0.06)` — a CSS value, not a hex — for glassmorphism overlay panels only. `orb-from` (`#F59E0B`) and `orb-to` (`#06B6D4`) drive the voice orb gradient: amber (warmth, energy) flowing to cyan (technology, clarity). No purple anywhere in the system.

## Typography

**Plus Jakarta Sans** is the single typeface. It is geometric but carries humanist warmth — it reads as modern and capable without feeling corporate or clinical. It is free on Google Fonts, loads fast on slow connections, and renders cleanly at small sizes on budget Android screens. The `display` level (40px/700, −0.02em tracking) is reserved for hero headlines and empty states — tight and impactful, directly echoing the bold white type in the reference poster. `h1` and `h2` carry section titles and agent names. `body` (16px/400, 1.6 line-height) prioritizes readability on small screens over density. `caption` (13px) handles metadata: dates, question counts, language tags. `mono` (JetBrains Mono, 14px) is for QR links and any code-adjacent content. Never set body copy below 14px.

## Layout

Spacing follows a 4px base scale (`spacing.1`–`spacing.8`, capping at 64px). The rhythm is **generous, not tight** — teachers and students are using phones, often under pressure, and dense UIs create errors and frustration. Standard card padding is `spacing.5` (24px). Page gutters are `spacing.6` (32px) on mobile, expanding on tablet. The layout is single-column on mobile with a max-width of 480px for the student interface and 720px for the teacher dashboard. No multi-column grids on mobile. Vertical rhythm uses `spacing.5` (24px) as the default gap between stacked cards. Header height is 64px (`nav-bar.height`). Touch targets are minimum 48px in every dimension.

## Elevation & Depth

In dark mode, depth is communicated through **color lightness, not drop shadows**. Each surface layer is a step lighter: `background` (#0B1929) → `surface` (#152339) → `surface-elevated` (#1E3050). Drop shadows on dark backgrounds look muddy — avoid them except for modal overlays (use `box-shadow: 0 24px 64px rgba(0,0,0,0.6)`). Glassmorphism (`card-glass`) uses `backdrop-filter: blur(16px)` and `rgba(255,255,255,0.06)` background — apply only to floating panels and the voice orb backdrop, not to regular content cards. In light mode, switch to soft drop shadows: `box-shadow: 0 2px 12px rgba(11,25,41,0.08)` for cards. The voice orb uses an ambient glow: `box-shadow: 0 0 40px rgba(245,158,11,0.4), 0 0 80px rgba(6,182,212,0.2)` — amber warm near, cyan cool far.

## Shapes

Cards use `rounded.lg` (16px) — substantial enough to feel modern, not so extreme it reads as a kids app. Input fields use `rounded.md` (12px) — slightly tighter to signal structured data entry. Chips and badges use `rounded.full` (9999px) — fully pill-shaped, matching the language-picker tags and category selectors seen in the references. The Nuru logo badge uses `rounded.full` — a perfect circle, referencing the "A" logo badge in the anchor image. The voice orb is `rounded.full` at 120px — a sphere. Buttons are `rounded.full` for primary and secondary CTAs, reinforcing the action-forward, mobile-native feel. Never use sharp corners (`rounded.none`) on interactive elements.

## Components

**Buttons:** `button-primary` (amber fill, navy text, pill-shaped, 48px height) is the single strongest CTA — used once per screen maximum. `button-secondary` (ghost with amber border, same dimensions) for secondary actions. `button-ghost` (no border, body text, 40px) for destructive or low-priority actions. The disabled state uses `border` fill and `secondary-text` color to signal unavailability without aggressive red.

**Cards:** `card` is the workhorse — dark `surface` background, `rounded.lg`, 24px padding. Use for agent list items, question log entries, settings panels. `card-glass` is reserved for overlays and the voice interface backdrop — never for scrollable list content.

**Inputs:** Dark `surface` background with a 1px `border` stroke. On focus, stroke upgrades to `primary` amber. Placeholder text uses `secondary-text`. Height is fixed at 48px to ensure tap accuracy.

**Chips:** Language and subject tags use `chip` (dark elevated surface) and `chip-active` (amber fill) with the same pill shape as buttons. Active chip gets amber fill with navy text — the same contrast pair as the primary button.

**Voice Orb:** The hero UI element. 120px diameter, `rounded.full`, amber-to-cyan gradient, ambient dual-color glow. In the listening state, animate a subtle pulse (`scale: 1.0 → 1.08`, 1.2s ease-in-out, infinite). In the speaking state, animate a breathing shimmer on the gradient. This is the most visually distinctive element in the product — the "pencil tip" that emits light.

**Messages:** Student messages (`message-student`) use a slightly lighter, tinted navy (`#1A3A5C`) to differentiate from agent replies. Agent messages (`message-agent`) use standard `surface`. Neither uses a pure colored bubble — avoid the SMS/WhatsApp visual language.

**Nav Bar:** 64px height, `background` fill (fully dark, no elevation), icon + label layout. Active state uses `primary` amber for the icon only — label stays `secondary-text`.

**Badge:** Amber fill, navy text, fully rounded, 20px size. Used for question count indicators and notification dots.

## Do's and Don'ts

**Do:**
- Use amber (`primary`) for one action per screen — it should feel like a spotlight, not wallpaper
- Use generous spacing (24px+) between list items; the teacher is scanning quickly between classes
- Treat the voice orb as the hero of the student interface — give it center stage and room to breathe
- Use `on-background` warm cream for body text, never pure white (`#FFFFFF`) — the warmth is intentional
- Keep the dark mode default; offer the light mode as a system-preference fallback, not a toggle the user must find
- Use `display` typography only for moments that deserve it: landing headlines, empty state "no agents yet", completion confirmations

**Don't:**
- Don't add purple, violet, or lavender to any UI surface or text — it conflicts with the amber/navy palette and drifts toward the AI-generic look Nuru rejects
- Don't use flat gray (`#6B7280`, etc.) for surfaces — always pull from the navy scale so everything reads as part of the same deep world
- Don't stack more than two levels of elevation in a single view — background → card is enough; avoid card → elevated-card → glass panel in the same screen
- Don't use the voice orb gradient (`orb-from`/`orb-to`) outside the orb itself — amber and cyan together are reserved for that element; using them elsewhere dilutes the orb's identity
- Don't add decorative illustrations or stock icons — the imagery language is photographic and cinematic (the child with the backpack, the pencil tip), not illustrated or icon-heavy
- Don't let any screen feel "complete" without a clear primary action in amber — every view should have one obvious next step
