import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const MarkdownWrapper = styled.div`
  font-family: ${FontFamily.body};
  font-size: ${FontSize.sm};
  color: ${Colors.textMain};
  line-height: 1.6;
  max-height: 70vh;
  overflow-y: auto;
  padding: ${Spacing.sm};

  h1 {
    font-size: ${FontSize.lg};
    font-weight: ${FontWeight.bold};
    margin: 0 0 ${Spacing.md};
    padding-bottom: ${Spacing.sm};
    border-bottom: 2px solid ${Colors.primaryDark};
    color: ${Colors.textMain};
  }

  h2 {
    font-size: ${FontSize.md};
    font-weight: ${FontWeight.bold};
    margin: ${Spacing.lg} 0 ${Spacing.sm};
    color: ${Colors.primaryDark};
    border-bottom: 2px solid ${Colors.primaryDark};
    padding-bottom: ${Spacing.xs};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  h3 {
    font-size: ${FontSize.sm};
    font-weight: ${FontWeight.semibold};
    margin: ${Spacing.md} 0 ${Spacing.xs};
    color: ${Colors.textSub};
  }

  p {
    margin: ${Spacing.sm} 0;
  }

  ul {
    margin: ${Spacing.xs} 0;
    padding-left: ${Spacing.lg};
  }

  li {
    margin: ${Spacing.xxs} 0;
  }

  strong {
    font-weight: ${FontWeight.semibold};
  }

  em {
    color: ${Colors.textSub};
  }

  hr {
    border: none;
    border-top: 1px solid ${Colors.surfaceBorder};
    margin: ${Spacing.md} 0;
  }
`
