import * as pdfMake from 'pdfmake/build/pdfmake'
import type { Content, ContentText, TDocumentDefinitions, TVirtualFileSystem } from 'pdfmake/interfaces'

export interface PdfCvMeta {
  fullName: string
  objective?: string
  location?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  portfolio?: string
}

type PdfMakeGlobal = typeof import('pdfmake/build/pdfmake') & { vfs: TVirtualFileSystem }

async function initializePdfMake(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const pdfMakeModule = await import('pdfmake/build/pdfmake')
    const { arimoVfs } = await import('./pdfFonts/arimoVfs.generated')

    ;(pdfMakeModule.default as PdfMakeGlobal).vfs = arimoVfs
    ;(pdfMakeModule.default as PdfMakeGlobal).fonts = {
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

export async function downloadMarkdownAsPdf(
  markdownContent: string,
  cv: PdfCvMeta,
  locale: string,
  jobTitle: string
): Promise<void> {
  try {
    await initializePdfMake()

    const objective = extractObjective(markdownContent) || cv.objective || jobTitle
    const safeFullName = safeFilenamePart(cv.fullName) || 'CV'
    const safeLocale = locale.replace(/[^a-zA-Z0-9-]/g, '') || 'en'
    const safeObjective = safeFilenamePart(objective) || 'CV'
    const now = new Date()
    const date = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const filename = `${safeFullName}_${safeLocale}_${safeObjective}_${date}.pdf`

    const content = convertMarkdownToPdfMake(markdownContent, cv, jobTitle)

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4' as const,
      pageMargins: [43.2, 14.4, 43.2, 14.4] as [number, number, number, number],
      defaultStyle: {
        font: 'Arimo',
        fontSize: 8.5,
        lineHeight: 1.25,
        color: PdfColors.textBody,
      },
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          color: PdfColors.headerBlue,
          margin: [0, 0, 0, 1.6],
        },
        contact: {
          fontSize: 8,
          color: PdfColors.textMuted,
          margin: [0, 0.8, 0, 0.8],
        },
        subheader: {
          fontSize: 9,
          bold: true,
          color: PdfColors.textBase,
          margin: [0, 6.4, 0, 0.8],
        },
        sectionTitle: {
          fontSize: 10,
          bold: true,
          color: PdfColors.headerBlue,
          margin: [0, 8, 0, 0],
        },
        normal: {
          fontSize: 8.5,
          color: PdfColors.textBody,
          margin: [0, 0.8, 0, 0.8],
        },
        list: {
          margin: [0, 0, 0, 1.6],
        },
        listItem: {
          fontSize: 8.5,
          color: PdfColors.textBody,
        },
      },
      content: content,
    }

    const pdfDoc = pdfMake.createPdf(docDefinition)
    pdfDoc.download(filename)

  } catch (error) {
    console.error('Error generating PDF with pdfMake:', error)
    await downloadMarkdownAsPdfFallback(markdownContent, cv, locale, jobTitle)
  }
}

function safeFilenamePart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60)
}

function extractObjective(markdown: string): string {
  const lines = markdown.split(/\r?\n/)
  const start = lines.findIndex((line) => /^##\s+(objective|objetivo)\s*$/i.test(line.trim()))
  if (start < 0) return ''
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim()
    if (!line) continue
    if (/^#{1,6}\s/.test(line)) return ''
    return line.replace(/[*_`]/g, '').trim()
  }
  return ''
}

const PdfColors = {
  headerBlue: '#2B579A',
  textBody: '#333333',
  textMuted: '#555555',
  textBase: '#000000',
}

function ensureHttps(url: string): string {
  return /^https?:\/\//.test(url) ? url : `https://${url}`
}

function withPipes(runs: ContentText[]): ContentText[] {
  return runs.flatMap((run, i) => (i === 0 ? [run] : [{ text: '   |   ', color: PdfColors.textMuted }, run]))
}

function convertMarkdownToPdfMake(
  markdownContent: string,
  cv: PdfCvMeta,
  jobTitle: string
): Content[] {
  const content: Content[] = []

  content.push({ text: cv.fullName, style: 'header', alignment: 'center' })

  const row1Values = [cv.location, cv.email, cv.phone].filter((v): v is string => !!v)
  if (row1Values.length) {
    content.push({
      text: withPipes(row1Values.map((v) => (v === cv.email ? { text: v, link: `mailto:${v}` } : { text: v }))),
      style: 'contact',
      alignment: 'center',
    })
  }

  const row2Values = [cv.linkedin, cv.github, cv.portfolio].filter((v): v is string => !!v)
  if (row2Values.length) {
    content.push({
      text: withPipes(row2Values.map((v) => ({ text: v.replace(/^https?:\/\//, ''), link: ensureHttps(v) }))),
      style: 'contact',
      alignment: 'center',
    })
  }

  const lines = markdownContent.split('\n')
  let inList = false
  let listItems: ContentText[] = []
  let lastWasHeading = false
  let justAfterSectionTitle = false
  let pendingTitleRuns: ContentText[] | null = null
  let pendingTitleJustAfterSectionTitle = false

  function flushPendingTitle() {
    if (!pendingTitleRuns) return
    const props: ContentText = { text: pendingTitleRuns, style: 'subheader' }
    if (pendingTitleJustAfterSectionTitle) props.margin = [0, 0, 0, 0.8]
    content.push(props)
    pendingTitleRuns = null
    pendingTitleJustAfterSectionTitle = false
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }
      flushPendingTitle()
      content.push({ text: '', fontSize: 3.2, margin: [0, 0, 0, 0] })
      lastWasHeading = false
      continue
    }

    if (trimmed.startsWith('# ')) {
      flushPendingTitle()
      lastWasHeading = false
      continue
    } else if (trimmed.startsWith('## ')) {
      flushPendingTitle()
      if (inList && listItems.length > 0) {
        content.push({ ul: listItems, style: 'list' })
        listItems = []
        inList = false
      }
      const title = trimmed.substring(3).trim().toUpperCase()
      content.push({ text: title, style: 'sectionTitle' })
      lastWasHeading = false
      justAfterSectionTitle = true
    } else if (trimmed.startsWith('### ')) {
      flushPendingTitle()
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
              { text: ' | ' + title.slice(sepIdx + 3).replace(/ \| /g, ' – '), bold: false, color: PdfColors.textMuted },
            ]
      pendingTitleRuns = titleRuns
      pendingTitleJustAfterSectionTitle = justAfterSectionTitle
      lastWasHeading = true
      justAfterSectionTitle = false
    } else if (trimmed.match(/^[-*+]\s/)) {
      flushPendingTitle()
      lastWasHeading = false
      justAfterSectionTitle = false
      inList = true
      const itemText = trimmed.substring(2).trim()
      const parsedText = parseInlineFormatting(itemText)
      listItems.push({ text: parsedText, style: 'listItem' })
    } else if (trimmed.match(/^\d+\.\s/)) {
      flushPendingTitle()
      lastWasHeading = false
      justAfterSectionTitle = false
      inList = true
      const itemText = trimmed.replace(/^\d+\.\s/, '').trim()
      const parsedText = parseInlineFormatting(itemText)
      listItems.push({ text: parsedText, style: 'listItem' })
    } else {
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }

      const isPeriodLine = lastWasHeading && /^\*\*(.+)\*\*$/.test(trimmed)
      if (isPeriodLine && pendingTitleRuns) {
        const inner = trimmed.slice(2, -2)
        const props: ContentText = {
          text: [...pendingTitleRuns, { text: ' | ', bold: false, color: PdfColors.textMuted }, { text: inner, italics: true, bold: false, color: PdfColors.textMuted }],
          style: 'subheader',
        }
        if (pendingTitleJustAfterSectionTitle) props.margin = [0, 0, 0, 0.8]
        content.push(props)
        pendingTitleRuns = null
        pendingTitleJustAfterSectionTitle = false
      } else {
        flushPendingTitle()
        const parsedText = parseInlineFormatting(trimmed)
        content.push({ text: parsedText, style: 'normal' })
      }
      lastWasHeading = false
      justAfterSectionTitle = false
    }
  }
  flushPendingTitle()

  if (inList && listItems.length > 0) {
    content.push({
      ul: listItems,
      style: 'list',
    })
  }

  return content
}

function parseInlineFormatting(text: string): Content {
  const parts: ContentText[] = []
  let currentText = ''
  let i = 0

  while (i < text.length) {
    if (text.substring(i, i + 3) === '***') {
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 3
      let end = text.indexOf('***', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, bold: true, italics: true })
      i = end + 3
    } else if (text.substring(i, i + 2) === '**') {
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 2
      let end = text.indexOf('**', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, bold: true })
      i = end + 2
    } else if (text[i] === '*') {
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 1
      let end = text.indexOf('*', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, italics: true })
      i = end + 1
    } else if (text.substring(i, i + 2) === '__') {
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 2
      let end = text.indexOf('__', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, bold: true })
      i = end + 2
    } else if (text[i] === '_') {
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 1
      let end = text.indexOf('_', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, italics: true })
      i = end + 1
    } else {
      currentText += text[i]
      i += 1
    }
  }

  if (currentText) {
    parts.push({ text: currentText })
  }

  if (parts.length === 1 && !parts[0].bold && !parts[0].italics) {
    return parts[0].text
  }

  return parts
}

async function downloadMarkdownAsPdfFallback(
  markdownContent: string,
  cv: PdfCvMeta,
  locale: string,
  jobTitle: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      let htmlContent = markdownContent
        .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
        .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

      const lines = htmlContent.split('\n')
      const processedLines: string[] = []
      let inList = false
      let listItems: string[] = []

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.match(/^[-*+]\s/)) {
          if (!inList) {
            inList = true
          }
          const content = trimmed.substring(2)
          listItems.push(`<li>${content}</li>`)
        } else if (trimmed.match(/^\d+\.\s/)) {
          if (!inList) {
            inList = true
          }
          const content = trimmed.replace(/^\d+\.\s/, '')
          listItems.push(`<li>${content}</li>`)
        } else {
          if (inList && listItems.length > 0) {
            processedLines.push(`<ul>${listItems.join('')}</ul>`)
            listItems = []
            inList = false
          }
          processedLines.push(line)
        }
      }

      if (inList && listItems.length > 0) {
        processedLines.push(`<ul>${listItems.join('')}</ul>`)
      }

      htmlContent = processedLines.join('\n')

      htmlContent = htmlContent.replace(/\n\n/g, '</p><p>')
      htmlContent = `<p>${htmlContent}</p>`

      htmlContent = htmlContent.replace(/<p><\/p>/g, '')
      htmlContent = htmlContent.replace(/<p>\s*<\/p>/g, '')

      const wrappedHtml = htmlContent

      const contactLine1 = [cv.location, cv.email, cv.phone].filter(Boolean).join(' | ')
      const contactLine2 = [cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(' | ')

      const htmlDoc = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <title>CV – ${cv.fullName}</title>
  <style>
    @page { size: A4; margin: 18mm 20mm; }
    * { box-sizing: border-box; }
    body { font-family: Verdana, Arial, sans-serif; font-size: 12pt; color: #1a1a1a; max-width: 170mm; margin: 0 auto; line-height: 1.55; }
    h1 { font-size: 22pt; margin: 0 0 4px; }
    h2 { font-size: 14pt; font-weight: 700; border-bottom: 1.5px solid #7c3aed; padding-bottom: 3px; margin: 18px 0 8px; color: #111; text-transform: uppercase; letter-spacing: .5px; }
    h3 { font-size: 13pt; font-weight: 600; margin: 10px 0 2px; }
    p, div { margin: 3px 0; }
    ul { margin: 4px 0; padding-left: 18px; }
    li { margin: 2px 0; }
    em { color: #555; }
    hr { border: none; border-top: 1px solid #ddd; margin: 14px 0; }
    strong { font-weight: 600; }
    br { margin-bottom: 8px; }
    .contact-info { font-size: 10.5pt; color: #555; margin: 4px 0; }
  </style>
</head>
<body>
  <h1>${cv.fullName}</h1>
  <p>${jobTitle}</p>
  ${contactLine1 ? `<div class="contact-info">${contactLine1}</div>` : ''}
  ${contactLine2 ? `<div class="contact-info">${contactLine2}</div>` : ''}
  <hr/>
  ${wrappedHtml}
</body>
</html>`

      const win = window.open('', '_blank')
      if (!win) {
        reject(new Error('Could not open print window'))
        return
      }

      win.document.write(htmlDoc)
      win.document.close()

      let printed = false
      const printTimeout = setTimeout(() => {
        if (!printed) {
          win.print()
          printed = true
          setTimeout(() => {
            win.close()
            resolve()
          }, 1000)
        }
      }, 500)

      win.onbeforeunload = () => {
        clearTimeout(printTimeout)
        if (!printed) {
          printed = true
          resolve()
        }
      }

    } catch (error) {
      reject(error)
    }
  })
}
