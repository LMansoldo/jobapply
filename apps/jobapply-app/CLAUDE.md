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

- No inline styles: style={{}} é proibido.
- Use styled do @emotion/styled para componentes com múltiplas regras ou props dinâmicas.
- Use css do @emotion/css para classes utilitárias simples.
- Arquivo .styles.ts obrigatório para cada componente que precise de estilos.
- Estilos dinâmicos: passe props para componentes styled (ex: <SkillBarFill percent={80} />).
- Sem magic numbers: converta pixels para rem (1rem=10px) e armazene como constantes nomeadas no topo do .styles.ts.

Exemplo (do CVTemplate.styles.ts):

const SKILL_BAR_HEIGHT = '0.6rem';   // 6px
const SKILL_BAR_BORDER_RADIUS = '0.3rem';

export const SkillBarFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => `${percent}%`};
  background: ${Colors.gradientProgressBar};
  border-radius: ${SKILL_BAR_BORDER_RADIUS};
`;

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

## i18n

All user-visible strings must use `useTranslation` from `react-i18next`. No hardcoded strings in JSX.

```ts
const { t } = useTranslation()
// Usage:
t('auth.login')
t('jobs.loadError')
t('auth.loginSuccess', { name: user.name })
```

Translations live in `src/i18n/translations.json` (keys for `pt-BR` and `en`).

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
