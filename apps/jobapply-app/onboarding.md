Refactor the onboarding screen. Current state: a plain chat-bubble feed on a white page. 
Reference: the mockup provided (two-column layout with dark sidebar + main chat area).

---

LAYOUT — split into two columns:

Left sidebar (280px, fixed height, dark bg `#0F0F1C`):
- Logo top-left
- Vertical step list with connecting lines between steps. Each step: numbered circle + label + subtitle.
  States: `done` (purple-tinted circle + checkmark icon), `active` (filled violet circle, glow shadow), `default` (dim gray).
  Connecting line between steps: `::after` pseudo-element on each row, `position: absolute`, hidden on last child.
- Bottom: a tip card (dark violet-tinted bg, small uppercase label, muted body text).

Right main area (flex column, full height):
- Thin header bar: page title left, step counter (dots + "Passo X de Y") right.
  Active dot: violet with glow. Done dot: `Colors.primaryMid`. Default: `Colors.surface3`.
- Chat feed (scrollable flex column, gap between rows).
- Question panel pinned to bottom (never scrolls).

---

CHAT BUBBLES:

Each message row: `display: flex`, `gap: 12px`. Avatar (32px circle) + bubble.
Bot avatar: `Colors.primary` bg, white icon. User avatar: `Colors.primaryLight` bg, violet icon.

Bubble variants (all in `OnboardingBubble.styles.ts`):
- `default`: white bg, `Colors.border` border, `border-radius: 4px 16px 16px 16px`
- `warning`: `#FFFBEB` bg, `#FDE68A` border, amber text — for AI disclaimer messages
- `feature-list`: `Colors.primaryLight` bg, `Colors.primaryMid` border — for feature highlight bubbles

Feature list items inside the `feature-list` bubble:
Each: flex row with 28×28px icon container (violet tinted bg, rounded) + label + subtitle. Separated by 1px border-bottom (violet alpha).

---

QUESTION PANEL (bottom, `flex-shrink: 0`):

- Label: 12px uppercase muted, letter-spacing 0.8px
- Options: flex row with `gap: 10px`, wrap. Each option is a card button (not a pill):
  - 112px min-width, flex column, icon + text
  - States: default (border `Colors.borderStrong`), hover (violet border + `Colors.primaryLight` bg), selected (violet border + `Colors.primaryLight` bg + `box-shadow: 0 0 0 3px rgba(violet, 0.12)`)
- Footer row: "Pular esta etapa" ghost button left + "Continuar" filled pill button right
  - Continuar: `Colors.primary` bg, right-arrow icon, `box-shadow` violet alpha, hover lifts

---

COMPONENT STRUCTURE:

`src/presentation/pages/OnboardingPage/`
  OnboardingPage.tsx              ← orchestrator (state, handlers)
  
`src/design-system/auth/` (or create `src/design-system/onboarding/`):
  OnboardingSidebar/
    OnboardingSidebar.tsx         ← presentational, receives `steps: OnboardingStep[]` + `currentStep: number`
    OnboardingSidebar.styles.ts
    OnboardingSidebar.types.ts
    helpers.ts
    index.ts

  OnboardingChatFeed/
    OnboardingChatFeed.tsx        ← renders message list, receives `messages: OnboardingMessage[]`
    OnboardingBubble.tsx          ← single bubble, variant-aware
    OnboardingChatFeed.styles.ts
    OnboardingBubble.styles.ts
    types.ts
    helpers.ts
    index.ts

  OnboardingQuestionPanel/
    OnboardingQuestionPanel.tsx   ← receives `question`, `options`, `onSelect`, `onContinue`, `onSkip`
    OptionCard.tsx                ← single option button
    OnboardingQuestionPanel.styles.ts
    OptionCard.styles.ts
    types.ts
    helpers.ts
    index.ts

---

TYPES:

interface OnboardingStep {
  label: string
  subtitle: string
  status: 'done' | 'active' | 'default'
}

interface OnboardingMessage {
  id: string
  sender: 'bot' | 'user'
  variant?: 'default' | 'warning' | 'feature-list'
  content: React.ReactNode
}

interface OnboardingOption {
  value: string
  label: string
  icon: React.ReactNode
}

---

RULES:
- No inline `style={{}}` anywhere
- All CSS in `.styles.ts` files with Emotion
- Use `Colors`, `Spacing`, `FontSize`, `Radius` tokens — no magic numbers
- Dark sidebar colors: define as named constants at top of `OnboardingSidebar.styles.ts`
- Max 80 lines JSX per file — split if needed
- `helpers.ts` in every component directory (even if just re-exports)
- i18n: all visible strings via `useTranslation()`