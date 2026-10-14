# @jobapply/ui

Kit de primitives UI em `@emotion/styled`, consumido via fonte pelo app (sem build step). Componentes em `src/components/<Name>/`.

## Componentes (9 primitives)
Badge, DSButton, DSCard, DSInput, InlineBadge, ProgressBar, ScoreRing, SkillTag, TipBox.

## Convenções

Cada componente segue a estrutura:
```
ComponentName/
├── ComponentName.tsx        — implementação
├── ComponentName.styles.ts  — estilos
├── ComponentName.types.ts   — tipos/props
└── index.ts                 — re-export público
```

- `src/index.ts` exporta tudo que é público (barrel).
- Contrato de tema: `src/theme.ts` (`UITheme`) — o kit NÃO importa tokens do app; o app é dono dos valores e tipa seu tema com `UITheme`.
- `src/emotion.d.ts` aplica `UITheme` ao `Theme` do @emotion/react dentro do kit.
- `src/theme.mock.ts` é theme de teste (stories/testes do kit).
- DSButton/DSInput/TipBox usam antd direto (Button/Input/Alert) dentro de `styled()`.

## PROIBIDO

- Importar de `apps/` — este pacote não conhece a aplicação
- Lógica de negócio ou chamadas HTTP
- Build step — pacote de fonte
