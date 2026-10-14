import StarterKit from '@tiptap/starter-kit'
import { flattenExtensions } from '@tiptap/core'
import { MarkdownManager } from '@tiptap/markdown'

const kit = StarterKit.configure({ heading: { levels: [1, 2, 3] } })
const manager = new MarkdownManager({ extensions: flattenExtensions([kit]), markedOptions: { gfm: false } })

const linkCases = {
  'explicit-link': '[Site](https://x.com)',
  'bare-url': 'see https://y.com here',
  'bare-email': 'mail a@b.com now',
  'angle-autolink': '<https://y.com>',
  'strike': 'done ~~nope~~',
  'table': '| a | b |\n| - | - |\n| 1 | 2 |',
  'hr-blank': 'a\n\n---\n\nb',
  'loose-list': '- a\n\n- b',
  'two-lists': '- a\n\n1. b',
  'empty-paras': 'a\n\n\n\nb',
  'asterisk-bullets': '* a\n* b',
  'plus-bullets': '+ a\n+ b',
  'nbsp-literal': 'a&nbsp;b',
  'entity-literal': 'tom &amp; jerry',
  'lt-literal': 'x &lt; y',
  'amp-lt': '&amp;lt;',
  'intraword-underscore': 'foo_bar_baz',
  'backslash': 'C:\\path and \\* not-em',
  'heading-h4': '#### deep',
  'quote': '> quoted',
}
for (const [name, md] of Object.entries(linkCases)) {
  let out
  try { out = manager.serialize(manager.parse(md)) } catch (e) { out = 'ERROR: ' + e.message }
  const eq = out === md
  console.log(`${eq ? 'SAME ' : 'DIFF '} ${name}`)
  if (!eq) console.log('   in :', JSON.stringify(md), '\n   out:', JSON.stringify(out))
}
