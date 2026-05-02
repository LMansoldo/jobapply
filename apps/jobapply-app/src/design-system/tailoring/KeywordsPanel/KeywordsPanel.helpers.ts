/**
 * @file KeywordsPanel.helpers.ts
 * @description Helper functions and hooks for the KeywordsPanel component.
 */
import { useState, useEffect } from 'react'
import type { EditorKeywords } from './KeywordsPanel.types'

/**
 * Hook to manage visible keywords with automatic removal
 */
export function useVisibleKeywords(editorKeywords?: EditorKeywords) {
  const [visibleToAdd, setVisibleToAdd] = useState<string[]>([])
  const [visibleToRephrase, setVisibleToRephrase] = useState<Array<{ from: string; to: string }>>([])

  // Initialize with editorKeywords when they change
  useEffect(() => {
    if (editorKeywords) {
      setVisibleToAdd(editorKeywords.toAdd)
      setVisibleToRephrase(editorKeywords.toRephrase)
    } else {
      setVisibleToAdd([])
      setVisibleToRephrase([])
    }
  }, [editorKeywords])

  const removeToAdd = (keyword: string) => {
    console.log('Removing keyword from toAdd:', keyword)
    setVisibleToAdd(prev => {
      const filtered = prev.filter(k => k !== keyword)
      console.log('New toAdd list:', filtered)
      return filtered
    })
  }

  const removeToRephrase = (from: string) => {
    console.log('Removing keyword from toRephrase:', from)
    setVisibleToRephrase(prev => {
      const filtered = prev.filter(k => k.from !== from)
      console.log('New toRephrase list:', filtered)
      return filtered
    })
  }

  return {
    visibleToAdd,
    visibleToRephrase,
    removeToAdd,
    removeToRephrase,
  }
}

/**
 * Calculate slidesToShow based on container width
 * With variableWidth: true, this becomes an approximate number of items
 */
export function calculateSlidesToShow(containerWidth: number): number {
  // With variableWidth, we need to estimate how many average items fit
  // Each keyword chip is approximately 100px wide + 6px gap
  const chipWidth = 100
  const gap = 6
  const availableWidth = containerWidth - 80 // Account for navigation buttons

  if (availableWidth <= 0) return 1

  const slides = Math.floor(availableWidth / (chipWidth + gap))
  return Math.max(1, Math.min(slides, 10)) // Between 1 and 10 slides
}