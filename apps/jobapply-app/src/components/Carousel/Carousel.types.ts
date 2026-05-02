/**
 * @file Carousel.types.ts
 * @description Type definitions for the Carousel wrapper component.
 */
import type { CarouselProps as AntCarouselProps } from 'antd'

/** Props for the Carousel wrapper. Extends Ant Design CarouselProps. */
export interface CarouselProps extends AntCarouselProps {}

/** Ref type for the Carousel wrapper. */
export type CarouselRef = any // Ant Design Carousel ref type