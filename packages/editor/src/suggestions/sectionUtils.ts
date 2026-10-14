import type { Node as PMNode } from '@tiptap/pm/model'

export function findSectionEnd(
  doc: PMNode,
  section: string | undefined,
): number {
  const target = (section ?? '').trim().toLowerCase()
  const children: Array<{ node: PMNode; offset: number }> = []
  doc.forEach((child, offset) => children.push({ node: child, offset }))

  if (target) {
    const startIdx = children.findIndex(
      (c) =>
        c.node.type.name === 'heading' &&
        c.node.textContent.toLowerCase().includes(target),
    )
    if (startIdx !== -1) {
      let end = children[startIdx].offset + children[startIdx].node.nodeSize
      for (let k = startIdx + 1; k < children.length; k += 1) {
        const c = children[k]
        if (c.node.type.name === 'heading') break
        end = c.offset + c.node.nodeSize
      }
      return end
    }
  }
  return doc.content.size
}
