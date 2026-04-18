# JobApply Frontend - Contexto para LLM

## 🏗️ **Arquitetura Geral**
- **Stack**: React 18 + TypeScript + Vite + Ant Design v5
- **Padrão**: Domain-Driven Design (DDD) com separação clara de camadas
- **Escala CSS**: `1rem = 10px` (html `font-size: 62.5%`)
- **Mock**: Ativar com `VITE_USE_MOCK=true` (demo: lucas@test.com/secret123)

---

## 📁 **Estrutura de Diretórios (DDD)**
```
src/
├── application/          # Cross-cutting concerns (providers, hooks)
├── domain/              # Domínios de negócio
│   ├── cv/              # Currículos
│   ├── jobs/            # Vagas de emprego  
│   ├── auth/            # Autenticação
│   └── voucher/         # Vouchers
├── infrastructure/      # API clients, repositories, mock
├── presentation/        # Pages e layout
├── components/          # Wrappers AntD (Container/Presentational)
├── design-system/       # Componentes reutilizáveis
└── styles/             # Tokens de tema
```

---

## 🔧 **Domínios de Negócio & Endpoints**

### **CV Domain** (`src/domain/cv/`)
**Componentes**:
- `CVBaseForm` - Formulário de criação/edição
- `CVViewer` - Visualizador de currículo
- `MonacoEditorPanel` - Editor de código

**Endpoints** (`ICVRepository`):
1. `getCV(id: string)` - Buscar CV
2. `createCV(payload)` - Criar CV
3. `updateCV(id, payload)` - Atualizar CV
4. `deleteCV(id)` - Excluir CV
5. `updateCVLocale(id, locale, payload)` - Atualizar localização
6. `deleteCVLocale(id, locale)` - Excluir localização
7. `publishCV(id, payload?)` - Publicar CV
8. `tailorCV(cvId, jobId)` - Personalizar CV para vaga

---

### **Jobs Domain** (`src/domain/jobs/`)
**Componentes**:
- `JobCard` - Card de vaga
- `JobContextBar` - Barra de contexto
- `JobDetail` - Detalhes da vaga
- `JobFilterBar` - Filtros

**Endpoints** (`IJobsRepository`):
1. `fetchJobs(filters?)` - Listar vagas
2. `bulkCreateJobs(payload)` - Criar múltiplas vagas
3. `deleteJob(id)` - Excluir vaga
4. `tailorJobDescription(id)` - Personalizar descrição

---

### **Auth Domain** (`src/domain/auth/`)
**Endpoints** (`IAuthRepository`):
1. `login(email, password)` - Autenticar
2. `register(name, email, password)` - Registrar

---

### **Voucher Domain** (`src/domain/voucher/`)
**Endpoints** (`IVoucherRepository`):
1. `listVouchers()` - Listar todos
2. `createVoucher(payload)` - Criar
3. `getVoucherByCode(code)` - Buscar por código
4. `redeemVoucher(code)` - Resgatar
5. `getPublicCV(publicId)` - CV público

---

## 🎨 **Design System Categories** (`src/design-system/`)
- **ATS**: `AIsuggestionBar`, `ATSPanel`, `KeywordItem`, `ToneChips`
- **Auth**: `AuthLayout`, `FeatureCard`, `PasswordStrength`, `SocialLoginBtn`
- **CV**: `AvatarUpload`, `CVPaper`, `CVTemplate`, `EditorToolbar`
- **Jobs**: `DSJobCard`, `FilterPanel`, `JobsHero`, `SalarySlider`
- **Layout**: `AppHeader`, `PageLayout`, `ProfileMenu`, `SidebarRight`
- **Primitives**: `DSButton`, `DSCard`, `DSInput`, `ProgressBar`, `ScoreRing`
- **Tailoring**: `ATSWorkspace`, `CoverLetterWorkspace`, `TailoringContextBar`, `TailoringEditorPanel`

---

## 🧩 **Componentes Wrapper AntD** (`src/components/`)
**Regra**: Nunca importar diretamente do `antd`

**Disponíveis**:
- `Alert`, `AntApp`, `Avatar`, `Badge`, `Button`, `Card`, `Carousel`
- `Col`, `Descriptions`, `Divider`, `Drawer`, `Dropdown`, `Empty`, `Form`
- `Grid`, `Input`, `Layout`, `Modal`, `Pagination`, `Popconfirm`, `Row`
- `Segmented`, `Select`, `Space`, `Spin`, `Steps`, `Tabs`, `Tag`
- `Title/Text/Paragraph`, `Tooltip`

**Estrutura por componente**:
```
ComponentName/
├── ComponentName.tsx        # Wrapper
├── ComponentName.types.ts   # Tipos
├── ComponentName.styles.ts  # Estilos Emotion
└── index.ts                 # Export
```

---

## 🎯 **Regras Técnicas Críticas**

### **1. Emotion Styling (STRICT)**
- ❌ `style={{}}` PROIBIDO
- ✅ Arquivo `.styles.ts` obrigatório
- ❌ `border-radius` PROIBIDO (seguir padrões existentes)
- ✅ Valores em `rem` (1rem = 10px)
- ✅ Constantes nomeadas no topo do arquivo

### **2. Arquitetura de Componentes**
- **Container/Presentational split**
- **Um componente por arquivo**
- **`helpers.ts` obrigatório** em diretórios de componentes
- **Hooks customizados** para lógica complexa (>3 linhas)
- **Tamanho máximo**: ~80 linhas de JSX

### **3. i18n (Duas Categorias)**
- **UI strings**: `useTranslation()` → `t('auth.login')`
- **Domain content**: Passado via props (já localizado pelo backend)

### **4. Pages (Páginas)**
- **Thin orchestrators only**
- Estado e handlers na página
- Renderização delegada para domain components
- Sem sub-componentes inline

---

## 🎨 **Theme Tokens** (`src/styles/theme/`)
```ts
import { Colors } from '../../styles/theme/colors'
import { Spacing } from '../../styles/theme/spacing'
import { FontSize } from '../../styles/theme/typography'

// Uso:
Colors.primary
Spacing.md      // 1.6rem
FontSize.base   // 1.6rem
```

**Arquivos disponíveis**:
- `colors.ts` - Cores
- `spacing.ts` - Espaçamento
- `typography.ts` - Tipografia
- `breakpoints.ts` - Breakpoints
- `radius.ts` - Raio de borda
- `shadows.ts` - Sombras
- `antdTheme.ts` - Tema AntD

---

## 🔗 **Infrastructure Layer**
- `http/` - Clientes HTTP
- `mock/` - Dados mock para desenvolvimento
- `repositories/` - Implementações dos repositórios

---

## 📝 **Git & Quality**
**Commit message format** (enforced):
```
type(Scope): description
```
**Types**: `feat`, `fix`, `bug`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

**Pre-commit**: stylelint com `--max-warnings 0`

---

## 🧠 **Padrões de Referência**
**Exemplo**: `CVTemplate` refatorado seguindo todas as regras:
- Container: `CVTemplate.tsx`
- Presentational: `HeaderSection.tsx`, `SummarySection.tsx`, etc.
- Styles: `CVTemplate.styles.ts` (sem magic numbers)
- Helpers: `helpers.ts` (funções puras)
- Types: `types.ts`

---

## 🚨 **Anti-Patterns (NUNCA FAZER)**
1. ❌ Importar do `antd` diretamente
2. ❌ Usar `style={{}}`
3. ❌ Componentes com múltiplas responsabilidades
4. ❌ Magic numbers em CSS
5. ❌ Lógica complexa em componentes presentacionais
6. ❌ Arquivos >80 linhas de JSX
7. ❌ Sem arquivo `.styles.ts`
8. ❌ Sem `helpers.ts` em diretórios de componentes

---

## 🔍 **Quick Reference**
- **Encontrar componentes de um domínio**: `src/domain/{domain}/components/`
- **Encontrar tipos**: `src/domain/{domain}/types.ts`
- **Encontrar helpers**: `src/domain/{domain}/helpers.ts`
- **Encontrar endpoints**: `src/domain/{domain}/repository.ts`
- **Wrapper AntD**: `src/components/{ComponentName}/`
- **Design System**: `src/design-system/{category}/`
- **Theme tokens**: `src/styles/theme/`

---

## 📊 **Resumo de Entidades Principais**
| Domínio | Componentes Principais | Endpoints Principais |
|---------|----------------------|---------------------|
| **CV** | CVBaseForm, CVViewer | getCV, createCV, tailorCV |
| **Jobs** | JobCard, JobDetail | fetchJobs, bulkCreateJobs |
| **Auth** | - | login, register |
| **Voucher** | - | listVouchers, redeemVoucher |
