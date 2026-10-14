import StarterKit from '@tiptap/starter-kit'
import { flattenExtensions } from '@tiptap/core'
import { MarkdownManager } from '@tiptap/markdown'

const kit = StarterKit.configure({ heading: { levels: [1, 2, 3] } })
const manager = new MarkdownManager({ extensions: flattenExtensions([kit]) })

const cases = {
  'heading-no-blank-after': '## H\npara',
  'heading-no-blank-before': 'para\n## H',
  'heading-then-list': '## H\n- a\n- b',
  'multi-blank': 'a\n\n\n\nb',
  'loose-list': '- a\n\n- b',
  'empty-para-mid': 'a\n\n\nb',
  'hr': 'a\n\n---\n\nb',
  'hr-no-blank': 'a\n---\nb',
  'list-then-para': '- a\n- b\nc',
  'nested-list': '- a\n  - a1\n- b',
  'entity-input': 'Tom & Jerry <x> "y" &amp; z',
  'escape-input': 'literal * star _ under [br] ~ tilde \\ back',
  'code-block': '```\nconst a = 1 & 2 * 3\n```',
  'inline-code': 'use `a * b` here',
  'bold-italic': '**bold** and *em* and ***both***',
  'link': '[Site](https://x.com) and bare https://y.com and a@b.com',
  'trailing-2sp-br': 'line1  \nline2',
  'ordered-list': '1. one\n2. two',
  'accent-emoji': 'Ação — crase áéíóú ç 🚀 ✅',
}
for (const [name, md] of Object.entries(cases)) {
  let out
  try { out = manager.serialize(manager.parse(md)) } catch (e) { out = 'ERROR: ' + e.message }
  const eq = out === md
  console.log(`--- ${name} ${eq ? 'IDENTICAL' : 'DIFFERS'}`)
  if (!eq) { console.log('in :', JSON.stringify(md)); console.log('out:', JSON.stringify(out)) }
}
