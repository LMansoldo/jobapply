/**
 * @file Slider.tsx
 * @description Wrapper around Ant Design Slider. Provides a single import point for the project.
 */
import { Slider as AntSlider } from 'antd'
import type { SliderProps } from './Slider.types'

/**
 * Wrapper around Ant Design Slider.
 * @param props - SliderProps forwarded to AntSlider
 */
export function Slider(props: SliderProps) {
  return <AntSlider {...props} />
}
