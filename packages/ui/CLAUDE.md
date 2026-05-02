# @jobapply/ui

Design system compartilhado. Wrappers sobre Ant Design com convenções do projeto.

## Status
Em setup. Componentes serão migrados de `apps/jobapply-app/src/components/` em tarefa futura.

## Convenções (quando migrar componentes)

Cada componente segue a estrutura:
```
ComponentName/
├── ComponentName.tsx        — implementação
├── ComponentName.styles.ts  — estilos
├── ComponentName.types.ts   — tipos/props
└── index.ts                 — re-export público
```

`src/index.ts` exporta tudo que é público.

## PROIBIDO

- Importar de `apps/` — este pacote não conhece a aplicação
- Lógica de negócio ou chamadas HTTP
- Dependências de runtime além de `react` e `antd`
