# JobApply Frontend — Architecture & Conventions

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Ant Design v5** (wrapped — never import from `antd` directly in pages or domain)
- **react-i18next** for all UI strings
- **react-router-dom** v6
- `1rem = 10px` (html `font-size: 62.5%` in `index.css`)

---

## Directory Structure (DDD)

```
src/
├── application/        # Cross-cutting app concerns (providers, hooks)
├── domain/             # Business domains
│   ├── cv/
│   │   ├── components/ # Domain-specific components (CVViewer, CVBaseForm, …)
│   │   │   └── CVTemplate/   # Example: a complex component with subcomponents
│   │   │       ├── CVTemplate.tsx        # Container
│   │   │       ├── CVTemplate.styles.ts  # All styled components
│   │   │       ├── helpers.ts            # Pure functions used only here
│   │   │       ├── HeaderSection.tsx     # Presentational
│   │   │       ├── SummarySection.tsx
│   │   │       └── ...
│   │   ├── constants/  # Magic numbers, template strings
│   │   ├── helpers/    # Shared pure functions across the domain
│   │   └── types/      # TypeScript interfaces/types for this domain
│   └── jobs/
│       ├── components/
│       ├── constants/
│       ├── helpers/
│       └── types/
├── infrastructure/     # API clients, repositories, mock layer
├── presentation/
│   ├── components/     # Shared layout (AppLayout)
│   └── pages/          # Route-level pages (thin orchestrators only)
├── components/         # AntD wrapper components (one per component)
└── styles/
    └── theme/
        ├── colors.ts
        ├── spacing.ts
        └── typography.ts
```
---


## Emotion Styling Rules (strict)

- No inline styles – `style={{}}` is forbidden in any component file.
- Always use `styled` from `@emotion/styled` for components with more than one style rule or dynamic props.
- Use `css` from `@emotion/css` for simple, reusable class strings (e.g., utility classes).
- Companion `.styles.ts` file – every component that requires styles must have a `ComponentName.styles.ts` file exporting all styled artifacts.
- Dynamic styles: pass props to `styled` components (e.g., `<SkillBarFill percent={80} />`). Compute class names or CSS variables when needed.
- No magic numbers – all pixel values must be converted to `rem` (using the `1rem = 10px` scale) and stored as named constants at the top of the `.styles.ts` file.

Example (from `CVTemplate.styles.ts`):
```
const SKILL_BAR_HEIGHT = '0.6rem';   // 6px
const SKILL_BAR_BORDER_RADIUS = '0.3rem';

export const SkillBarFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => `${percent}%`};
  background: ${Colors.gradientProgressBar};
  border-radius: ${SKILL_BAR_BORDER_RADIUS};
`;
```
---

## AntD Component Wrappers

**Never import from `antd` directly** in pages, domain components, or layout. Always use the project wrappers in `src/components/`.

Each wrapper follows the **Container/Presentational** pattern:

```
src/components/Button/
├── Button.tsx        # Wrapper component
├── Button.types.ts   # Type definitions
└── index.ts          # Barrel export
```

Available wrappers: `Alert`, `Avatar`, `Badge`, `Button`, `Card`, `Col`, `Descriptions`, `Divider`, `Dropdown`, `Empty`, `Form` + `FormItem`, `Input` + `InputPassword`, `Layout` (`AppLayout`, `AppHeader`, `AppContent`), `Modal`, `Pagination`, `Popconfirm`, `Row`, `Segmented`, `Select`, `Space`, `Spin`, `Steps`, `Tabs`, `Tag`, `Title` + `Text` + `Paragraph`, `Tooltip`, `AntApp` + `useAntApp`.

---

## Theme Tokens

Use **only** theme tokens for colors, spacing, and font sizes. Never hardcode values.

```ts
import { Colors }   from '../../styles/theme/colors'
import { Spacing }  from '../../styles/theme/spacing'
import { FontSize } from '../../styles/theme/typography'
```

- `Colors.*` — all color values
- `Spacing.*` — rem-based spacing (e.g. `Spacing.md` = `1.6rem`)
- `FontSize.*` — rem-based font sizes (e.g. `FontSize.base` = `1.6rem`)

---

## i18n – Two categories

### 1. UI strings (fixed labels, buttons, error messages)
Use `useTranslation` from `react-i18next` inside the component. No hardcoded strings in JSX.

```ts
const { t } = useTranslation()
// Usage:
t('auth.login')
t('jobs.loadError')
t('auth.loginSuccess', { name: user.name })
```

Translations live in `src/i18n/translations.json` (keys for `pt-BR` and `en`).

### 2. Domain content (dynamic data that is already localized)
Examples: job descriptions, CV sections, user-generated text. These come from the backend or locale props and do NOT use `useTranslation`. They are passed as props to presentational components.

> Rule: If the string is part of the UI chrome, use `t()`. If it's business data (like a CV summary or experience highlights), it must be injected via props.

Translations for UI live in `src/i18n/translations.json` (keys for `pt-BR` and `en`).

---

## Page Components

Pages are **thin orchestrators**. They:
- Own state and handlers
- Delegate rendering to domain components
- Use `useAntApp()` for `message`, `modal`, `notification`
- Import only from `src/components/` (wrappers), domain components, theme, and i18n

No inline sub-components, no direct AntD imports, no hardcoded strings or colors.

---

## Domain Components

Auxiliary functions → `domain/<name>/helpers/`  
Types/interfaces → `domain/<name>/types/`  
Magic values / template strings → `domain/<name>/constants/`

---

## Component Architecture Rules (mandatory)

- Single Responsibility: every component has exactly one job. If you cannot describe it in one sentence without "and", split it.
- Container / Presentational split:
  - Container (`Foo.tsx`): owns state, hooks, event handlers. No visual logic.
  - Presentational (`FooBar.tsx`): pure render from props. Only allowed hook is `useTranslation`. Zero local state.
- File size: no component file should exceed ~80 lines of JSX. Extract if it does.
- One component per file: never export two components from the same file.
- Sub-component naming: prefix with the parent name (`JobsHero` → `HeroHeadline`, `HeroSearchForm`, `HeroQuickChips`).
- `helpers.ts` is mandatory in every domain component directory. Pure functions and constants live there — never inline in component files.
- Custom hooks: extract `useState`/`useEffect`/`useCallback`/`useRef` logic beyond 3 lines into a hook in `domain/<name>/hooks/`.
- Render props: when a child needs to render variable content, use a render prop instead of internal conditions.
- No inline styles — ever: `style={{}}` props are forbidden. Use `@emotion/styled` or `@emotion/css` exclusively. All styles go into a `*.styles.ts` file. No exceptions.

---

## Reference Refactor: `CVTemplate`

A complete refactor of the CV template component was done following all the rules above. It serves as a living example:

- Container: `CVTemplate.tsx` – receives `cv` and `locale`, normalizes skills, renders the grid.
- Presentational components: `HeaderSection`, `SummarySection`, `ExperienceSection`, `EducationSection`, `SkillsSection`, `LanguagesSection`, `CertificationsSection` – each in its own file, only rendering from props.
- Styles: `CVTemplate.styles.ts` – all styled components, no magic numbers, all units in `rem`.
- Helpers: `helpers.ts` – pure functions for flattening skills, normalizing percentages, and mapping language levels to colors.
- No inline styles, no direct AntD, no hardcoded strings – the only strings are section titles (which could be i18n-ed later if needed) and domain data from `locale`.

This refactor proves the pattern works and should be followed for any new complex component.

---

## Git Hooks (Husky)

### Commit message format (enforced by `.husky/commit-msg`):

```
type(Scope): description
```

**Types:** `feat`, `fix`, `bug`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

**Examples:**
```
feat(Auth): add OAuth login support
fix(Jobs): correct pagination offset
refactor(CV): extract parser to helpers
```

### Pre-commit (enforced by `.husky/pre-commit`):

`lint-staged` runs **stylelint** on staged `*.css` files with `--max-warnings 0`. Any warning or error blocks the commit.

---

## Mock Layer

Set `VITE_USE_MOCK=true` in `.env` to use mock data instead of the real API. The mock layer lives in `src/infrastructure/`.

Demo credentials: `lucas@test.com` / `secret123`
