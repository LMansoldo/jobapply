import { defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
    exclude: [
      ...defaultExclude,
      'src/presentation/components/tailoring/KeywordsPanel/KeywordsPanel.test.tsx',
    ],
    environment: 'node',
    environmentMatchGlobs: [['src/**/*.test.tsx', 'jsdom']],
  },
})
