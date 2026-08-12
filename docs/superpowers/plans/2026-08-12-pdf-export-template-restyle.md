# PDF Export Template Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the pdfMake-based CV PDF export (`apps/jobapply-app/src/domain/cv/helpers.ts`) to match a reference ATS-style template (Calibri-based Word doc), using an ATS-safe open-source Arial-metric-compatible font instead of the current Roboto/icon-based design.

**Architecture:** No new services, no contract changes. This only touches the pdfMake `docDefinition` construction inside `convertMarkdownToPdfMake()` / `downloadMarkdownAsPdf()` in `helpers.ts` — the same function used by both `CVViewer.tsx` (general "Export PDF") and the tailoring workspace export (`useTailoringExport.ts`). The markdown generation (`localeVersionToMarkdown`), the Monaco editor, and the `.md` export are **not** touched — the PDF converter is adjusted to render the existing markdown structure closer to the reference, without changing what that markdown contains.

**Tech Stack:** pdfMake (already a dependency), a new embedded font (Arimo, statically instantiated from Google Fonts' variable font via `fonttools`).

## Global Constraints

- No contract changes (`AgentInput`, `ATSReport`, `CV` stay untouched) — this is a pure `jobapply-app` rendering change.
- No new npm dependencies. Font files are committed as static assets (raw `.ttf` + a generated base64 `.ts` module), not pulled in via a font npm package at runtime.
- `apps/jobapply-app` has **no test runner configured** (no vitest/jest, no `test` script). Do not add one as a side effect of this plan. "Verification" steps in this plan mean: generate a real PDF (via a throwaway Node script using the already-installed `pdfmake` package, or via the running app) and visually inspect it — either by opening the PDF, or by rendering a PNG thumbnail with `qlmanage -t -s 1200 -o <dir> <file>.pdf` (macOS Quick Look) and viewing it with the Read tool.
- Reference visual source: `/Users/lucasmansoldo/Downloads/Lucas_Mansoldo_CV_ATS.docx`. Extracted tokens (from `word/document.xml` inside the docx):
  - Colors: header/name/section-titles `#2B579A`, body text `#333333`, secondary text (contact, location/period) `#555555`, role title `#000000`.
  - Page margins: 0.75in left/right, 0.5in top/bottom → pdfMake `pageMargins: [54, 36, 54, 36]` (points, `[left, top, right, bottom]`).
  - Name: 16pt bold, centered.
  - Section titles: 12pt bold, uppercase, bottom border `0.75pt` solid `#2B579A`.
  - Body text: 10.5pt.
  - Contact / secondary text: 10pt.
  - No SVG icons in the header — contact info is plain text, centered, separated by `" | "`.
  - No job-title subtitle line under the name (target role only appears inside the `## Objetivo`/`## Objective` section body, which `prependObjectiveSection()` already generates as a normal section — no new code needed for that part).
- Decisions already made with the user (do not re-litigate):
  - Font: Arimo (open-source, Apache 2.0, metrically compatible with Arial/Helvetica) — chosen over a Calibri clone for maximum ATS-parser compatibility.
  - Header subtitle (job title under the name) is removed entirely; target role lives only in the Objetivo section body.
  - Experience entries (`### Role | Company Location` + `**Period**` line) are **approximated** in the PDF renderer only — role is bold black, rest of the H3 line is regular gray, and the line immediately following (which is markdown-bold, e.g. `**Jun 2025 – Presente**`) is rendered italic-gray instead of bold. The markdown itself (`localeVersionToMarkdown`) is not restructured.

---

### Task 1: Embed the Arimo font (static weights, ATS-safe, license-clean)

**Files:**
- Create: `apps/jobapply-app/src/domain/cv/pdfFonts/Arimo-Regular.ttf`
- Create: `apps/jobapply-app/src/domain/cv/pdfFonts/Arimo-Bold.ttf`
- Create: `apps/jobapply-app/src/domain/cv/pdfFonts/Arimo-Italic.ttf`
- Create: `apps/jobapply-app/src/domain/cv/pdfFonts/Arimo-BoldItalic.ttf`
- Create: `apps/jobapply-app/src/domain/cv/pdfFonts/OFL.txt`
- Create: `apps/jobapply-app/src/domain/cv/pdfFonts/arimoVfs.generated.ts`
- Modify: `apps/jobapply-app/src/domain/cv/helpers.ts:459-486` (`initializePdfMake`)

**Interfaces:**
- Produces: `arimoVfs: Record<string, string>` (filename → base64 TTF), exported from `pdfFonts/arimoVfs.generated.ts`. Later tasks' `docDefinition.defaultStyle.font` will be `'Arimo'`.

Arimo ships from Google Fonts only as a variable font (`wght` axis). pdfMake does not do variable-font instancing at render time — if you feed it the raw variable font, `bold: true` silently renders at the default (regular) weight, which is a visible correctness bug. So we pre-instantiate 4 static weights with `fonttools` and commit the static `.ttf` files.

- [ ] **Step 1: Install fonttools (one-time, local tool, not a project dependency)**

```bash
pip3 install --quiet fonttools
```

- [ ] **Step 2: Download the Arimo variable fonts from the Google Fonts repo (OFL-licensed)**

```bash
cd apps/jobapply-app/src/domain/cv/pdfFonts
curl -sL -o Arimo-VF.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/arimo/Arimo%5Bwght%5D.ttf"
curl -sL -o Arimo-Italic-VF.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/arimo/Arimo-Italic%5Bwght%5D.ttf"
curl -sL -o OFL.txt "https://raw.githubusercontent.com/google/fonts/main/ofl/arimo/OFL.txt"
```

Expected: both `.ttf` files are ~400-550KB, `OFL.txt` is a plain-text license (SIL Open Font License).

- [ ] **Step 3: Instantiate static Regular/Bold/Italic/BoldItalic weights**

```bash
export PATH="$PATH:$(python3 -m site --user-base)/bin"
fonttools varLib.instancer -q -o Arimo-Regular.ttf Arimo-VF.ttf wght=400
fonttools varLib.instancer -q -o Arimo-Bold.ttf Arimo-VF.ttf wght=700
fonttools varLib.instancer -q -o Arimo-Italic.ttf Arimo-Italic-VF.ttf wght=400
fonttools varLib.instancer -q -o Arimo-BoldItalic.ttf Arimo-Italic-VF.ttf wght=700
rm Arimo-VF.ttf Arimo-Italic-VF.ttf
```

Expected: 4 static `.ttf` files, ~320-350KB each, in `apps/jobapply-app/src/domain/cv/pdfFonts/`.

- [ ] **Step 4: Generate the base64 vfs module pdfMake will load in the browser**

```bash
cd /Users/lucasmansoldo/Projects/jobapply
node -e "
const fs = require('fs')
const path = require('path')
const dir = 'apps/jobapply-app/src/domain/cv/pdfFonts'
const files = ['Arimo-Regular', 'Arimo-Bold', 'Arimo-Italic', 'Arimo-BoldItalic']
const entries = files.map(f => \`  '\${f}.ttf': '\${fs.readFileSync(path.join(dir, f + '.ttf')).toString('base64')}',\`).join('\n')
const out = \`/**\n * Generated by: fonttools varLib.instancer (Arimo variable font -> static weights) + base64 encode.\n * Source: https://github.com/google/fonts/tree/main/ofl/arimo (OFL-1.1, see OFL.txt in this directory).\n * To regenerate, see Task 1 of docs/superpowers/plans/2026-08-12-pdf-export-template-restyle.md.\n */\nexport const arimoVfs: Record<string, string> = {\n\${entries}\n}\n\`
fs.writeFileSync(path.join(dir, 'arimoVfs.generated.ts'), out)
console.log('wrote', path.join(dir, 'arimoVfs.generated.ts'))
"
```

Expected: `arimoVfs.generated.ts` created, ~1.7MB text file exporting an object with exactly the 4 keys above.

- [ ] **Step 5: Wire the new font into `initializePdfMake`**

Replace the current implementation (`apps/jobapply-app/src/domain/cv/helpers.ts:461-485`):

```ts
// Initialize pdfMake with fonts
async function initializePdfMake(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    // Load pdfMake and vfs_fonts (contains Roboto fonts)
    const pdfMakeModule = await import('pdfmake/build/pdfmake')
    const vfsFonts = await import('pdfmake/build/vfs_fonts')

    // Assign vfs to pdfMake
    ;(pdfMakeModule.default as any).vfs = vfsFonts.default

    // Register Roboto fonts from vfs_fonts (available fonts)
    ;(pdfMakeModule.default as any).fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    }
  } catch (error) {
    console.warn('Failed to initialize pdfMake:', error)
  }
}
```

with:

```ts
// Initialize pdfMake with the embedded Arimo font (ATS-safe, Arial-metric-compatible)
async function initializePdfMake(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const pdfMakeModule = await import('pdfmake/build/pdfmake')
    const { arimoVfs } = await import('./pdfFonts/arimoVfs.generated')

    ;(pdfMakeModule.default as any).vfs = arimoVfs
    ;(pdfMakeModule.default as any).fonts = {
      Arimo: {
        normal: 'Arimo-Regular.ttf',
        bold: 'Arimo-Bold.ttf',
        italics: 'Arimo-Italic.ttf',
        bolditalics: 'Arimo-BoldItalic.ttf',
      },
    }
  } catch (error) {
    console.warn('Failed to initialize pdfMake:', error)
  }
}
```

Do **not** touch the `docDefinition.defaultStyle.font = 'Roboto'` line in `downloadMarkdownAsPdf` in this task — Task 2 Step 5 replaces that whole block (including this line) as part of rewriting `docDefinition`. Editing it here first would make Task 2's exact-text replace fail to match. The app's PDF export stays on `'Roboto'` (which Task 1 no longer registers) until Task 2 lands — that's expected; Task 1's own verification (Step 6 below) exercises the font files directly via a standalone script, not the app's export path.

- [ ] **Step 6: Verify the fonts render correctly (regular/bold/italic/bold-italic)**

```bash
cd /Users/lucasmansoldo/Projects/jobapply
node -e "
const fs = require('fs')
const path = require('path')
const PdfPrinter = require('pdfmake')
const dir = 'apps/jobapply-app/src/domain/cv/pdfFonts'
const fonts = {
  Arimo: {
    normal: path.join(dir, 'Arimo-Regular.ttf'),
    bold: path.join(dir, 'Arimo-Bold.ttf'),
    italics: path.join(dir, 'Arimo-Italic.ttf'),
    bolditalics: path.join(dir, 'Arimo-BoldItalic.ttf'),
  },
}
const printer = new PdfPrinter(fonts)
const doc = printer.createPdfKitDocument({
  defaultStyle: { font: 'Arimo', fontSize: 12 },
  content: [
    { text: 'Regular abc 123' },
    { text: 'Bold abc 123', bold: true, margin: [0, 4, 0, 0] },
    { text: 'Italic abc 123', italics: true, margin: [0, 4, 0, 0] },
  ],
})
const out = fs.createWriteStream('/tmp/arimo-check.pdf')
doc.pipe(out)
doc.end()
out.on('finish', () => console.log('done'))
"
qlmanage -t -s 800 -o /tmp /tmp/arimo-check.pdf
```

Expected: `/tmp/arimo-check.pdf.png` shows three visually distinct weights/styles (bold is clearly heavier, italic is clearly slanted) with no glyph corruption. View it with the Read tool to confirm.

- [ ] **Step 7: Typecheck and commit**

```bash
yarn workspace jobapply-app typecheck
git add apps/jobapply-app/src/domain/cv/pdfFonts apps/jobapply-app/src/domain/cv/helpers.ts
git commit -m "feat(cv): embed Arimo font for ATS-safe PDF export"
```

---

### Task 2: Rebuild the PDF header and typography tokens

**Files:**
- Modify: `apps/jobapply-app/src/domain/cv/helpers.ts` (`convertMarkdownToPdfMake` header block, `downloadMarkdownAsPdf` docDefinition styles/margins)

**Interfaces:**
- Consumes: `arimoVfs` font registration from Task 1 (font name `'Arimo'`).
- Produces: a `PdfColors` const (local to `helpers.ts`) with `headerBlue`, `textBody`, `textMuted`, `textBase` — used by Task 3 and Task 4 too.

- [ ] **Step 1: Add the `PdfColors` token object**

Add just above `function makeContactItem` (`apps/jobapply-app/src/domain/cv/helpers.ts:582`):

```ts
// Colors matching the ATS reference template (independent of the app's UI theme).
const PdfColors = {
  headerBlue: '#2B579A',
  textBody: '#333333',
  textMuted: '#555555',
  textBase: '#000000',
}
```

- [ ] **Step 2: Delete the icon constants and `makeContactItem`/`ensureHttps` is kept, icons removed**

Delete these lines entirely (`apps/jobapply-app/src/domain/cv/helpers.ts:574-597`):

```ts
// SVG paths for contact icons (Material Design, 24×24 viewBox)
const ICON_LOCATION = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
const ICON_EMAIL    = 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
const ICON_PHONE    = 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'
const ICON_LINKEDIN = 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z'
const ICON_GITHUB   = 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z'
const ICON_GLOBE    = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'

function makeContactItem(iconPath: string, label: string, link?: string): any {
  const color = link ? Colors.primaryDeeper : '#444'
  return {
    columns: [
      {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${Colors.primaryDeeper}"><path d="${iconPath}"/></svg>`,
        width: 9,
        height: 9,
        margin: [0, 1.5, 3, 0],
      },
      { text: label, link: link ?? undefined, color, fontSize: 9, width: 'auto', decoration: link ? 'underline' : undefined },
    ],
    columnGap: 0,
    width: 'auto',
  }
}
```

Keep `ensureHttps` (still used for the linkedin/github/portfolio links).

- [ ] **Step 3: Add the `withPipes` helper next to `ensureHttps`**

```ts
function ensureHttps(url: string): string {
  return /^https?:\/\//.test(url) ? url : `https://${url}`
}

// Interleaves "  |  " separators between pdfMake text runs (used for the header contact rows).
function withPipes(runs: any[]): any[] {
  return runs.flatMap((run, i) => (i === 0 ? [run] : [{ text: '   |   ', color: PdfColors.textMuted }, run]))
}
```

- [ ] **Step 4: Rewrite the header block**

Replace (`apps/jobapply-app/src/domain/cv/helpers.ts:613-636`):

```ts
  // ── Header ────────────────────────────────────────────────────────────────
  content.push({ text: cv.fullName, style: 'header' })
  if (jobTitle) content.push({ text: jobTitle, style: 'jobTitle' })

  // ── Contact row 1: location · email · phone ───────────────────────────────
  const row1: any[] = []
  if (cv.location) row1.push(makeContactItem(ICON_LOCATION, cv.location))
  if (cv.email)    row1.push(makeContactItem(ICON_EMAIL, cv.email, `mailto:${cv.email}`))
  if (cv.phone)    row1.push(makeContactItem(ICON_PHONE, cv.phone))
  if (row1.length) content.push({ columns: row1, columnGap: 14, margin: [0, 3, 0, 2] })

  // ── Contact row 2: linkedin · github · portfolio ──────────────────────────
  const row2: any[] = []
  if (cv.linkedin) row2.push(makeContactItem(ICON_LINKEDIN, cv.linkedin.replace(/^https?:\/\//, ''), ensureHttps(cv.linkedin)))
  if (cv.github)   row2.push(makeContactItem(ICON_GITHUB, cv.github.replace(/^https?:\/\//, ''), ensureHttps(cv.github)))
  const site = cv.portfolio
  if (site) row2.push(makeContactItem(ICON_GLOBE, site.replace(/^https?:\/\//, ''), ensureHttps(site)))
  if (row2.length) content.push({ columns: row2, columnGap: 14, margin: [0, 0, 0, 4] })

  // ── Divider ───────────────────────────────────────────────────────────────
  content.push({
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 523, y2: 0, lineWidth: 1.5, lineColor: Colors.primaryDark }],
    margin: [0, 2, 0, 8],
  })
```

with:

```ts
  // ── Header ────────────────────────────────────────────────────────────────
  content.push({ text: cv.fullName, style: 'header', alignment: 'center' })

  // ── Contact row 1: location · email · phone ───────────────────────────────
  const row1Values = [cv.location, cv.email, cv.phone].filter((v): v is string => !!v)
  if (row1Values.length) {
    content.push({
      text: withPipes(row1Values.map((v) => (v === cv.email ? { text: v, link: `mailto:${v}` } : { text: v }))),
      style: 'contact',
      alignment: 'center',
    })
  }

  // ── Contact row 2: linkedin · github · portfolio ──────────────────────────
  const row2Values = [cv.linkedin, cv.github, cv.portfolio].filter((v): v is string => !!v)
  if (row2Values.length) {
    content.push({
      text: withPipes(row2Values.map((v) => ({ text: v.replace(/^https?:\/\//, ''), link: ensureHttps(v) }))),
      style: 'contact',
      alignment: 'center',
    })
  }
```

Note: the `jobTitle` parameter is no longer rendered in the header (per the user's decision — target role only lives in the Objetivo section body). It's still accepted by `downloadMarkdownAsPdf`/`convertMarkdownToPdfMake` and still used for the downloaded filename — do not remove the parameter, only its header usage. This will make the `jobTitle` parameter of `convertMarkdownToPdfMake` unused inside the function body; keep it in the signature (still needed by call sites / consistent API) but expect a `noUnusedParameters` — check `tsconfig.json` for that flag; if it's on, prefix with `_jobTitle` is wrong (call sites use positional args, not named) — instead keep using it only for the filename in `downloadMarkdownAsPdf` (it already is), and in `convertMarkdownToPdfMake` simply stop referencing it. If `noUnusedParameters` is enabled and causes a typecheck failure on the now-unused `jobTitle` param in `convertMarkdownToPdfMake`, prefix the parameter name with an underscore (`_jobTitle`) in that function's signature only.

- [ ] **Step 5: Update `docDefinition` — margins, styles, font**

Replace (`apps/jobapply-app/src/domain/cv/helpers.ts`, inside `downloadMarkdownAsPdf`):

```ts
    const docDefinition: any = {
      pageSize: 'A4' as const,
      pageMargins: [36, 28, 36, 28] as [number, number, number, number],
      defaultStyle: {
        fontSize: 10,
        lineHeight: 1.25,
        color: '#1a1a1a',
      },
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 3],
        },
        subheader: {
          fontSize: 12,
          bold: true,
          color: '#222',
          margin: [0, 4, 0, 1],
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          color: Colors.primaryDeeper,
          margin: [0, 6, 0, 1],
        },
        jobTitle: {
          fontSize: 11,
          color: '#555',
          margin: [0, 0, 0, 4],
        },
        normal: {
          fontSize: 10,
          margin: [0, 0, 0, 0],
        },
        list: {
          margin: [0, 0, 0, 2],
        },
        listItem: {
          fontSize: 10,
        },
      },
      content: content,
    }
    

    // Use Roboto fonts registered in initializePdfMake()
    docDefinition.defaultStyle.font = 'Roboto'
```

with:

```ts
    const docDefinition: any = {
      pageSize: 'A4' as const,
      pageMargins: [54, 36, 54, 36] as [number, number, number, number],
      defaultStyle: {
        font: 'Arimo',
        fontSize: 10.5,
        lineHeight: 1.25,
        color: PdfColors.textBody,
      },
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: PdfColors.headerBlue,
          margin: [0, 0, 0, 2],
        },
        contact: {
          fontSize: 10,
          color: PdfColors.textMuted,
          margin: [0, 1, 0, 1],
        },
        subheader: {
          fontSize: 11,
          bold: true,
          color: PdfColors.textBase,
          margin: [0, 8, 0, 1],
        },
        sectionTitle: {
          fontSize: 12,
          bold: true,
          color: PdfColors.headerBlue,
          margin: [0, 12, 0, 2],
        },
        normal: {
          fontSize: 10.5,
          color: PdfColors.textBody,
          margin: [0, 1, 0, 1],
        },
        list: {
          margin: [0, 0, 0, 2],
        },
        listItem: {
          fontSize: 10.5,
          color: PdfColors.textBody,
        },
      },
      content: content,
    }
```

(`jobTitle` style is removed — it's no longer pushed anywhere. `font: 'Arimo'` now lives directly in `defaultStyle`, so also delete Task 1 Step 6's temporary `docDefinition.defaultStyle.font = 'Arimo'` line if you added it — it's redundant with this block.)

- [ ] **Step 6: Verify — generate a PDF from real CV data and inspect the header**

```bash
cd /Users/lucasmansoldo/Projects/jobapply
yarn workspace jobapply-app dev &
sleep 3
```

Open the app, go to a CV with contact info filled in, click "Export PDF" (`CVViewer`), open the downloaded PDF (or thumbnail it with `qlmanage -t -s 1200 -o /tmp <file>.pdf` and view with Read). Confirm: name centered/bold/blue, no icons, contact rows centered plain text with `|` separators, no subtitle line under the name, no stray divider line between the header and the first section title.

Stop the dev server after checking.

- [ ] **Step 7: Typecheck and commit**

```bash
yarn workspace jobapply-app typecheck
git add apps/jobapply-app/src/domain/cv/helpers.ts
git commit -m "feat(cv): restyle PDF header to match ATS reference template"
```

---

### Task 3: Section title styling (uppercase, blue underline)

**Files:**
- Modify: `apps/jobapply-app/src/domain/cv/helpers.ts` (H2 branch inside `convertMarkdownToPdfMake`)

**Interfaces:**
- Consumes: `PdfColors` from Task 2.

- [ ] **Step 1: Update the H2 (`## `) branch**

Replace (`apps/jobapply-app/src/domain/cv/helpers.ts:664-676`):

```ts
    } else if (trimmed.startsWith('## ')) {
      // H2 - section title with underline
      if (inList && listItems.length > 0) {
        content.push({ ul: listItems, style: 'list' })
        listItems = []
        inList = false
      }
      const title = trimmed.substring(3).trim()
      content.push({ text: title, style: 'sectionTitle' })
      content.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 523, y2: 0, lineWidth: 1.5, lineColor: Colors.primaryDeeper }],
        margin: [0, 1, 0, 3],
      })
    }
```

with:

```ts
    } else if (trimmed.startsWith('## ')) {
      // H2 - section title, uppercase, with blue underline
      if (inList && listItems.length > 0) {
        content.push({ ul: listItems, style: 'list' })
        listItems = []
        inList = false
      }
      const title = trimmed.substring(3).trim().toUpperCase()
      content.push({ text: title, style: 'sectionTitle' })
      content.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 523, y2: 0, lineWidth: 0.75, lineColor: PdfColors.headerBlue }],
        margin: [0, 1, 0, 4],
      })
    }
```

- [ ] **Step 2: Verify — regenerate the PDF, check section titles**

Repeat Task 2 Step 6's verification flow. Confirm every `## ` heading (Resumo, Skills, Experience, etc.) renders in caps, bold, blue, with a thin blue rule underneath — regardless of the case used in the source markdown.

- [ ] **Step 3: Typecheck and commit**

```bash
yarn workspace jobapply-app typecheck
git add apps/jobapply-app/src/domain/cv/helpers.ts
git commit -m "feat(cv): uppercase PDF section titles and match reference underline"
```

---

### Task 4: Experience entry styling (role/company split, italic period line)

**Files:**
- Modify: `apps/jobapply-app/src/domain/cv/helpers.ts` (H3 branch and paragraph branch inside `convertMarkdownToPdfMake`)

**Interfaces:**
- Consumes: `PdfColors` from Task 2.
- Produces: none (leaf rendering change).

The markdown for an experience entry looks like:
```
### Senior Software Engineer | Venturus (R&D center...) | Campinas, Brasil (Remoto)
**Jun 2025 – Presente**

Context paragraph...
- highlight bullet
```
We want: the H3 line's text before the first `" | "` in bold black, the rest in regular gray; and the very next line, if it's a paragraph whose *entire* content is `**...**` (i.e. the period line), to render italic gray instead of bold.

- [ ] **Step 1: Add a tracking flag before the parse loop**

Find (`apps/jobapply-app/src/domain/cv/helpers.ts:639-641`):

```ts
  const lines = markdownContent.split('\n')
  let inList = false
  let listItems: any[] = []
```

Replace with:

```ts
  const lines = markdownContent.split('\n')
  let inList = false
  let listItems: any[] = []
  let lastWasHeading = false
```

- [ ] **Step 2: Reset the flag on every branch except H3**

In the blank-line branch (`apps/jobapply-app/src/domain/cv/helpers.ts:646-658`), add `lastWasHeading = false` right after `content.push({ text: '', margin: [0, 0, 0, 0] })`:

```ts
    if (!trimmed) {
      // Empty line - close list if open
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }
      content.push({ text: '', margin: [0, 0, 0, 0] })
      lastWasHeading = false
      continue
    }
```

In the H1 branch, add `lastWasHeading = false` before `continue`:

```ts
    if (trimmed.startsWith('# ')) {
      // H1 - already handled in header
      lastWasHeading = false
      continue
```

In the H2 branch (from Task 3), add `lastWasHeading = false` right after pushing the divider canvas (end of that `else if` block).

In the list-item and ordered-list-item branches, add `lastWasHeading = false` at the start of each branch (before the existing `inList = true` line). Find:

```ts
    } else if (trimmed.match(/^[-*+]\s/)) {
      // List item
      inList = true
      const itemText = trimmed.substring(2).trim()
      // Parse bold/italic in list items
      const parsedText = parseInlineFormatting(itemText)
      listItems.push({ text: parsedText, style: 'listItem' })
    } else if (trimmed.match(/^\d+\.\s/)) {
      // Ordered list item
      inList = true
      const itemText = trimmed.replace(/^\d+\.\s/, '').trim()
      const parsedText = parseInlineFormatting(itemText)
      listItems.push({ text: parsedText, style: 'listItem' })
    } else {
```

Replace with:

```ts
    } else if (trimmed.match(/^[-*+]\s/)) {
      // List item
      lastWasHeading = false
      inList = true
      const itemText = trimmed.substring(2).trim()
      // Parse bold/italic in list items
      const parsedText = parseInlineFormatting(itemText)
      listItems.push({ text: parsedText, style: 'listItem' })
    } else if (trimmed.match(/^\d+\.\s/)) {
      // Ordered list item
      lastWasHeading = false
      inList = true
      const itemText = trimmed.replace(/^\d+\.\s/, '').trim()
      const parsedText = parseInlineFormatting(itemText)
      listItems.push({ text: parsedText, style: 'listItem' })
    } else {
```

- [ ] **Step 3: Rewrite the H3 branch to split role/company**

Replace (`apps/jobapply-app/src/domain/cv/helpers.ts:677-688`):

```ts
    } else if (trimmed.startsWith('### ')) {
      // H3 - subsection
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }
      const title = trimmed.substring(4).trim()
      content.push({ text: title, style: 'subheader' })
    }
```

with:

```ts
    } else if (trimmed.startsWith('### ')) {
      // H3 - subsection (experience/education role line). Split "Role | Company ..." so the
      // role reads bold black and the rest (company/location) reads regular gray, matching
      // the reference template.
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }
      const title = trimmed.substring(4).trim()
      const sepIdx = title.indexOf(' | ')
      const titleRuns =
        sepIdx === -1
          ? [{ text: title, bold: true, color: PdfColors.textBase }]
          : [
              { text: title.slice(0, sepIdx), bold: true, color: PdfColors.textBase },
              { text: title.slice(sepIdx), bold: false, color: PdfColors.textMuted },
            ]
      content.push({ text: titleRuns, style: 'subheader' })
      lastWasHeading = true
    }
```

- [ ] **Step 4: Style the period line that follows an H3 as italic-gray instead of bold**

Replace (`apps/jobapply-app/src/domain/cv/helpers.ts:702-716`):

```ts
    } else {
      // Regular paragraph
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }

      // Parse inline formatting (bold, italic, etc.)
      const parsedText = parseInlineFormatting(trimmed)
      content.push({ text: parsedText, style: 'normal' })
    }
```

with:

```ts
    } else {
      // Regular paragraph
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }

      // The line right after an experience/education H3 is the "**Period**" (or
      // "**Location | Period**") line. Render it italic-gray instead of bold, matching
      // the reference template's location/period styling.
      const isPeriodLine = lastWasHeading && /^\*\*(.+)\*\*$/.test(trimmed)
      if (isPeriodLine) {
        const inner = trimmed.slice(2, -2)
        content.push({ text: inner, italics: true, color: PdfColors.textMuted, style: 'normal' })
      } else {
        // Parse inline formatting (bold, italic, etc.)
        const parsedText = parseInlineFormatting(trimmed)
        content.push({ text: parsedText, style: 'normal' })
      }
      lastWasHeading = false
    }
```

- [ ] **Step 5: Verify — regenerate the PDF, check experience entries**

Repeat Task 2 Step 6's verification flow against a CV with at least one experience entry that has a location (so the H3 line has a `" | "` in it). Confirm: role is bold black, company/location after the first `|` is regular gray, and the period line (`**Jun 2025 – Presente**` etc.) renders italic gray, not bold. Confirm bullets/context paragraphs under the entry are unaffected (still regular `normal` style).

- [ ] **Step 6: Typecheck and commit**

```bash
yarn workspace jobapply-app typecheck
git add apps/jobapply-app/src/domain/cv/helpers.ts
git commit -m "feat(cv): approximate role/company/period styling in PDF export"
```

---

### Task 5: Full visual verification against the reference

**Files:** none (verification only).

- [ ] **Step 1: Export a real PDF covering every section type**

Using the running app (`yarn workspace jobapply-app dev`), export a PDF for a CV that has: location, email, phone, linkedin, github, portfolio, an Objetivo/Objective section (auto-generated by the tailoring flow, or via `CVViewer` if `cv.objective` prepending is present), Resumo/Summary, Skills, at least two Experience entries (one with a location, one without), Education, Certifications, Languages.

- [ ] **Step 2: Compare against the reference**

```bash
qlmanage -t -s 1600 -o /tmp /tmp/<exported-file>.pdf
```

Open both the generated thumbnail and re-open `/Users/lucasmansoldo/Downloads/Lucas_Mansoldo_CV_ATS.docx` (via `qlmanage -t -s 1600 -o /tmp '/Users/lucasmansoldo/Downloads/Lucas_Mansoldo_CV_ATS.docx'`) with the Read tool side by side. Check: colors match (`#2B579A` blue, grays), margins feel proportionally similar, section titles are capitalized with the blue rule, no leftover icons, no subtitle under the name, spacing doesn't look cramped or excessively loose.

If spacing looks off (too tight/too loose between sections, around the name, or around bullets), adjust the `margin` arrays introduced in Task 2/3/4's `styles` object — these were converted from the docx's twip values but weren't pixel-verified end-to-end; this step is where you tune them.

- [ ] **Step 3: Confirm text is real, extractable text (not outlined/rasterized)**

```bash
textutil -convert txt /tmp/<exported-file>.pdf -output /tmp/exported-check.txt
cat /tmp/exported-check.txt
```

Expected: the name, contact info, and section content appear as plain readable text (confirms the embedded Arimo font produces a real-text, ATS-parseable PDF, not glyph outlines).

- [ ] **Step 4: Run the full workspace typecheck and lint**

```bash
yarn workspace jobapply-app typecheck
yarn workspace jobapply-app lint
```

Expected: both pass with no errors introduced by this change.

- [ ] **Step 5: Final commit (if Step 2 required margin adjustments)**

```bash
git add apps/jobapply-app/src/domain/cv/helpers.ts
git commit -m "fix(cv): tune PDF export spacing after visual verification against reference"
```

(Skip this commit if no adjustments were needed.)
