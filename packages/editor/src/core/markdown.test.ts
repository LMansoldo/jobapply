import { describe, expect, it } from 'vitest'
import { docToMarkdown, markdownToDoc, normalize } from './markdown'

const fixtureModules = import.meta.glob<string>('./__fixtures__/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const fixtures = Object.entries(fixtureModules).map(([path, md]) => ({
  name: path.split('/').pop() as string,
  md,
}))

describe('normalize rules', () => {
  it('a. converts CRLF and lone CR to LF', () => {
    expect(normalize('a\r\nb\rc')).toBe('a\nb\nc\n')
  })

  it('b. ensures a single newline at EOF', () => {
    expect(normalize('a')).toBe('a\n')
    expect(normalize('a\n\n\n')).toBe('a\n')
    expect(normalize('')).toBe('')
  })

  it('c. converts * and + bullets at line start to -', () => {
    expect(normalize('* a\n+ b\n  * c')).toBe('- a\n- b\n  - c\n')
    expect(normalize('**bold** text')).toBe('**bold** text\n')
    expect(normalize('*em* text')).toBe('*em* text\n')
  })

  it('d. removes trailing whitespace per line', () => {
    expect(normalize('a \nb\t\n')).toBe('a\nb\n')
  })

  it('e. decodes HTML entities emitted by the serializer', () => {
    expect(normalize('Tom &amp; Jerry &lt;x&gt; &quot;y&quot;')).toBe(
      'Tom & Jerry <x> "y"\n',
    )
  })

  it('f. unescapes backslash-escaped markdown syntax', () => {
    expect(normalize('a \\* b \\_ c \\~ \\\\ d')).toBe('a * b _ c ~ \\ d\n')
  })

  it('g. collapses 2+ blank lines to one', () => {
    expect(normalize('a\n\n\n\nb')).toBe('a\n\nb\n')
  })

  it('h. tightens lists by removing blank lines between items', () => {
    expect(normalize('- a\n\n- b')).toBe('- a\n- b\n')
    expect(normalize('1. a\n\n2. b')).toBe('1. a\n2. b\n')
    expect(normalize('- a\n\nparagraph')).toBe('- a\n\nparagraph\n')
    expect(normalize('- a\n\n1. b')).toBe('- a\n\n1. b\n')
    expect(normalize('  - a\n\n1. b')).toBe('  - a\n1. b\n')
  })

  it('i. pads list starts with a blank line after a paragraph', () => {
    expect(normalize('text\n- a\n- b')).toBe('text\n\n- a\n- b\n')
    expect(normalize('text\n1. a')).toBe('text\n\n1. a\n')
    expect(normalize('- a\n- b')).toBe('- a\n- b\n')
  })

  it('j. pads headings with exactly one blank line around them', () => {
    expect(normalize('para\n## H\nnext')).toBe('para\n\n## H\n\nnext\n')
    expect(normalize('## H\npara')).toBe('## H\n\npara\n')
    expect(normalize('para\n## H')).toBe('para\n\n## H\n')
  })

  it('k. clears blank-only &nbsp; lines kept by the serializer', () => {
    expect(normalize('a\n&nbsp;\nb')).toBe('a\n\nb\n')
  })
})

describe('round-trip', () => {
  it.each(fixtures.map((f) => [f.name, f.md]))(
    'preserves %s through normalize → doc → markdown → normalize',
    (_name, md) => {
      const doc = markdownToDoc(normalize(md))
      const back = normalize(docToMarkdown(doc))
      expect(back).toEqual(normalize(md))
    },
  )

  it('preserves an empty document', () => {
    expect(normalize(docToMarkdown(markdownToDoc('')))).toEqual(normalize(''))
  })

  it('preserves a whitespace-only document', () => {
    expect(normalize(docToMarkdown(markdownToDoc('  \n\n  ')))).toEqual(
      normalize('  \n\n  '),
    )
  })

  it('is idempotent on the serialized form', () => {
    for (const { md } of fixtures) {
      const doc = markdownToDoc(normalize(md))
      const once = normalize(docToMarkdown(doc))
      const twice = normalize(docToMarkdown(markdownToDoc(once)))
      expect(twice).toEqual(once)
    }
  })
})
