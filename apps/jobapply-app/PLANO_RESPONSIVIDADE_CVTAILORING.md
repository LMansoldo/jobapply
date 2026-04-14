# Plano de Responsividade - CVTailoringPage

## Contexto
A página CVTailoringPage e seus componentes estão com layout mobile desajustado. Componentes assumem larguras máximas de desktop sem estilos mobile, quebrando a viewport e prejudicando a experiência de navegação no mobile.

## Objetivo
Implementar ajuste responsivo completo para mobile, tablet e desktop, utilizando wrappers AntD quando possível para facilitar a UI responsiva.

## Componentes e Arquivos Identificados

### Página Principal
- `src/presentation/pages/CVTailoringPage/CVTailoringPage.tsx`
- `src/presentation/pages/CVTailoringPage/CVTailoringPage.styles.ts`

### Componentes de Layout
- `src/design-system/tailoring/TailoringContextBar/` (3 arquivos)
- `src/design-system/tailoring/TailoringWorkspaceTabs/` (3 arquivos)
- `src/domain/jobs/components/JobContextBar/` (3 arquivos - **URGENTE: usa estilos inline**)

### Workspaces
- `src/design-system/tailoring/ATSWorkspace/` (3 arquivos)
- `src/design-system/tailoring/CoverLetterWorkspace/` (3 arquivos)
- `src/design-system/tailoring/VideoScriptWorkspace/` (3 arquivos)

## Problemas Críticos Identificados

### 1. Larguras Fixas
- `CVTailoringPage.styles.ts`: `gridTemplateColumns: '25rem 1fr 50rem'` (ATS grid)
- `CVTailoringPage.styles.ts`: `gridTemplateColumns: '1fr 30rem'` (Cover/Video grids)
- `ATSWorkspace.styles.ts`: `gridTemplateColumns: '25vw 1fr 25vw'` (ainda fixo em vw)

### 2. Alturas Problemáticas
- `pageRoot`: `height: calc(100vh - 6.4rem)` - quebra em mobile
- Alturas fixas em `vh` sem considerar viewport mobile

### 3. Violação de Regras do Projeto
- `JobContextBar.tsx`: Usa estilos inline (`style={{}}`) - **PROIBIDO pelo CLAUDE.md**
- Deve migrar para Emotion com arquivo `.styles.ts`

### 4. Breakpoints Inconsistentes
- Alguns componentes usam `768px`
- Outros usam `475px`
- Muitos não têm breakpoints
- Nenhuma padronização

### 5. Overflow Mal Gerenciado
- Scrolls aninhados
- `overflow: 'hidden'` em containers que precisam de scroll
- Alturas mínimas/máximas conflitantes

## Estratégia de Responsividade

### Breakpoints Padronizados
```ts
// Sugerido em src/styles/theme/breakpoints.ts
export const breakpoints = {
  xs: '0px',      // Extra small (mobile)
  sm: '576px',    // Small (mobile landscape/tablet pequeno)
  md: '768px',    // Medium (tablet)
  lg: '992px',    // Large (desktop pequeno)
  xl: '1200px',   // Extra large (desktop)
  xxl: '1600px',  // Extra extra large (wide desktop)
}
```

### Viewports Alvo
- **Mobile (0-575px)**: Smartphones em portrait
- **Tablet (576-991px)**: Tablets e smartphones landscape
- **Desktop (992px+)**: Desktops e laptops

## Componentes AntD Recomendados

### Para Layout Responsivo
1. **Grid (Row/Col)** - Layouts responsivos com breakpoints
2. **Tabs** - Com `mode="top|left"` responsivo
3. **Drawer** - Para sidebars em mobile
4. **Modal** - Para conteúdo auxiliar em mobile
5. **Dropdown** - Para menus em espaços reduzidos

### Para UX Melhorada
6. **Collapse** - Para seções recolhíveis
7. **Tooltip** - Para informações em espaços compactos  
8. **Carousel** - Para navegar entre sugestões
9. **Segmented** - Para alternância compacta

## Plano de Implementação por Fases

### Fase 1: Estrutura Base (Semana 1)
**Objetivo**: Criar fundamentos responsivos e corrigir violações

#### Tarefas:
1. **Criar `src/styles/theme/breakpoints.ts`**
   - Definir breakpoints padronizados
   - Exportar media query helpers

2. **Criar `src/hooks/useResponsive.ts`**
   - Hook para detectar breakpoints atuais
   - Helper para renderização condicional

3. **Refatorar `JobContextBar`**
   - Migrar estilos inline para Emotion
   - Criar `JobContextBar.styles.ts`
   - Implementar layout responsivo:
     - Desktop: Logo + título + badges + ações inline
     - Tablet: Logo + título compacto + badge
     - Mobile: Logo pequeno + título truncado + menu hamburger

4. **Atualizar `CVTailoringPage.styles.ts`**
   - Substituir `height: calc(100vh - 6.4rem)` por altura flexível
   - Implementar container responsivo
   - Adicionar breakpoints padronizados

### Fase 2: ATSWorkspace Responsivo (Semana 2)
**Objetivo**: Transformar layout 3-colunas em adaptativo

#### Layout Alvo:
- **Desktop (>992px)**: 3 colunas (25% | 50% | 25%)
- **Tablet (576-991px)**: 2 colunas (40% | 60%) + preview abaixo
- **Mobile (<576px)**: 1 coluna + drawer para ATS + modal para preview

#### Tarefas:
1. **Refatorar `ATSWorkspace.styles.ts`**
   - Substituir grid complexo por Row/Col AntD
   - Implementar breakpoints padronizados
   - Corrigir problemas de overflow

2. **Implementar Drawer para Painel ATS (mobile)**
   - Usar componente Drawer do AntD
   - Acionar por botão/hamburger menu
   - Preservar estado entre aberturas

3. **Melhorar Modal de Sugestões (mobile)**
   - Expandir implementação existente
   - Adicionar carousel para navegação
   - Melhorar UX touch

4. **Editor Responsivo**
   - Textarea com tamanho adaptativo
   - Toolbar fixa no topo em mobile
   - Ajustes para teclado virtual

### Fase 3: CoverLetter e VideoScript Responsivos (Semana 3)
**Objetivo**: Adaptar layouts 2-colunas

#### Layout Alvo:
- **Desktop/Tablet**: 2 colunas (70% | 30%)
- **Mobile**: 1 coluna + accordion/drawer para controles

#### Tarefas:
1. **Refatorar `CoverLetterWorkspace.styles.ts`**
   - Substituir grid fixo por Row/Col responsivo
   - Implementar accordion para controles AI em mobile
   - Ajustar textarea responsiva

2. **Refatorar `VideoScriptWorkspace.styles.ts`**
   - Padronizar com CoverLetterWorkspace
   - Implementar layout responsivo consistente

3. **Componentes AI Responsivos**
   - `ToneChips`: Grid responsivo ou carousel
   - Botões com tamanhos adaptativos
   - Formulários com labels acima em mobile

### Fase 4: Otimizações e Polish (Semana 4)
**Objetivo**: Melhorar performance e UX

#### Tarefas:
1. **Performance Mobile**
   - Lazy loading de componentes pesados
   - Virtualização de listas longas (sugestões, keywords)
   - Otimizar re-renders com React.memo/useMemo

2. **UX Mobile**
   - Gestos (swipe para navegar entre abas/sugestões)
   - Touch targets adequados (>44px)
   - Scroll suave e nativo
   - Feedback tátil (toast, confirmações)

3. **Acessibilidade**
   - Labels para screen readers
   - Contraste de cores em diferentes tamanhos
   - Navegação por teclado/touch
   - ARIA attributes

4. **Testes e Validação**
   - Testar em viewports reais (Chrome DevTools)
   - Verificar touch interactions
   - Validar em dispositivos iOS/Android
   - Testar orientação portrait/landscape

## Estratégias por Componente

### 1. TailoringContextBar
```tsx
// Estratégia: Flexbox responsivo
- Desktop: Todos elementos visíveis
- Tablet: Reduzir espaçamento, compactar texto
- Mobile: Menu hamburger para ações secundárias
```

### 2. TailoringWorkspaceTabs  
```tsx
// Estratégia: Tabs AntD com mode responsivo
- Desktop: mode="top" (horizontal completo)
- Tablet: mode="top" (compacto)
- Mobile: mode="left" (vertical) ou Segmented
```

### 3. ATSWorkspace
```tsx
// Estratégia: Grid adaptativo + drawers
- Desktop: <Row><Col lg={6}><Col lg={12}><Col lg={6}></Row>
- Tablet: <Row><Col md={12}><Col md={24}></Row> + preview em nova linha
- Mobile: 1 coluna + <Drawer> para ATS + <Modal> para preview
```

### 4. CoverLetterWorkspace
```tsx
// Estratégia: Grid + accordion
- Desktop/Tablet: <Row><Col lg={16}><Col lg={8}></Row>
- Mobile: <Collapse> para controles AI abaixo do editor
```

## Regras Técnicas a Respeitar

### 1. Estilização (CLAUDE.md)
- ✅ Nenhum estilo inline - usar Emotion
- ✅ Todos estilos em arquivos `.styles.ts`
- ✅ Usar tokens do tema (Colors, Spacing, FontSize)
- ✅ `1rem = 10px` (converter todos pixels)

### 2. AntD Wrappers
- ✅ Usar wrappers de `src/components/` (Button, Modal, etc.)
- ❌ Nunca importar diretamente de `antd`
- ✅ Manter consistência visual

### 3. Responsividade
- ✅ Mobile-first approach
- ✅ Breakpoints padronizados
- ✅ Fallbacks progressivos
- ✅ Testar em 3 viewports mínimo

### 4. Performance
- ✅ Evitar reflows custosos
- ✅ Usar `will-change` cuidadosamente
- ✅ Otimizar imagens/recursos
- ✅ Code splitting quando apropriado

## Novos Arquivos a Criar

1. `src/styles/theme/breakpoints.ts`
```ts
export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px', 
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
}

export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  // ...
}
```

2. `src/hooks/useResponsive.ts`
```tsx
import { useMediaQuery } from 'react-responsive'
// ou implementação customizada
```

3. `src/design-system/tailoring/responsiveHelpers.ts` (opcional)
```ts
// Funções utilitárias para responsividade
```

## Métricas de Sucesso

### UX
- [ ] Navegação fluida em mobile (<3s entre interações)
- [ ] Touch targets >44px
- [ ] Sem horizontal scroll não intencional
- [ ] Texto legível sem zoom

### Performance
- [ ] First Contentful Paint <3s (mobile 3G)
- [ ] Time to Interactive <5s
- [ ] Lighthouse score >80 (mobile)

### Funcional
- [ ] Todas funcionalidades disponíveis em mobile
- [ ] Layout não quebra em rotação
- [ ] Keyboard navigation funcional
- [ ] Screen reader compatível

## Riscos e Mitigações

### Risco 1: Complexidade do Grid ATS
**Mitigação**: Implementar gradualmente, começar com fallback simples (1 coluna), depois adicionar complexidade.

### Risco 2: Performance em Dispositivos Antigos
**Mitigação**: Testar em dispositivos reais, implementar lazy loading, otimizar re-renders.

### Riso 3: Consistência Visual entre Breakpoints
**Mitigação**: Usar sistema de design tokens, criar guias de estilo responsivo, revisão de UI cross-breakpoint.

### Risco 4: Manutenção de Código Duplicado
**Mitigação**: Criar componentes responsivos base, extrair lógica comum para hooks, documentar padrões.

## Próximos Passos Imediatos

1. **Prioridade 1**: Refatorar JobContextBar (estilos inline)
2. **Prioridade 2**: Criar breakpoints padronizados
3. **Prioridade 3**: Implementar estrutura base responsiva
4. **Testar incrementalmente** após cada componente

## Time Estimate
- **Fase 1**: 3-5 dias (base + JobContextBar)
- **Fase 2**: 4-6 dias (ATSWorkspace complexo)
- **Fase 3**: 2-4 dias (Cover/Video mais simples)
- **Fase 4**: 3-5 dias (otimizações + testes)
- **Total**: 12-20 dias úteis

---

*Documento gerado em: 2026-04-12*  
*Última revisão: Fase 1 priorizada para início imediato*