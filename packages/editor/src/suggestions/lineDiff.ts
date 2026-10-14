export interface LineDiffRow {
  type: 'same' | 'added' | 'removed'
  text: string
}

export function diffLines(base: string, current: string): LineDiffRow[] {
  const a = base.split('\n')
  const b = current.split('\n')
  const n = a.length
  const m = b.length
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  )
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  const rows: LineDiffRow[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      rows.push({ type: 'same', text: b[j] })
      i += 1
      j += 1
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: 'removed', text: a[i] })
      i += 1
    } else {
      rows.push({ type: 'added', text: b[j] })
      j += 1
    }
  }
  while (i < n) {
    rows.push({ type: 'removed', text: a[i] })
    i += 1
  }
  while (j < m) {
    rows.push({ type: 'added', text: b[j] })
    j += 1
  }
  return rows
}
