/**
 * @file Typography.types.ts
 * @description Type definitions for the Typography wrapper components (Title, Text, Paragraph).
 */
import { Typography } from 'antd'
import type React from 'react'

/** Props for the Title wrapper. */
export type TitleProps = React.ComponentProps<typeof Typography.Title>

/** Props for the Text wrapper. */
export type TextProps = React.ComponentProps<typeof Typography.Text>

/** Props for the Paragraph wrapper. */
export type ParagraphProps = React.ComponentProps<typeof Typography.Paragraph>
