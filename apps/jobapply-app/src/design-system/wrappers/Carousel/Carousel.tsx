/**
 * @file Carousel.tsx
 * @description Wrapper around Ant Design Carousel. Provides a single import point for the project.
 */
import { Carousel as AntCarousel } from 'antd'

/**
 * Wrapper around Ant Design Carousel.
 * @param props - CarouselProps forwarded to AntCarousel
 */
export const Carousel = AntCarousel

// Note: We're using the AntCarousel directly since it already has proper TypeScript support
// and doesn't need additional styling wrappers for basic usage.
// Custom styling can be applied via className prop if needed.