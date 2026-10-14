import styled from '@emotion/styled'
import { CheckOutlined } from '@ant-design/icons'
import { Colors } from '../../../styles/theme/colors'
import { FontFamily, FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const MOBILE = '@media (max-width: 767px)'
const TINY = '@media (max-width: 374px)'

export const Root = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.lg} 0`};
  gap: 0;

  ${MOBILE} {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  }

  ${TINY} {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  }
`

export const StepOuter = styled.div<{ $last: boolean }>`
  display: flex;
  align-items: flex-start;
  flex: ${({ $last }) => ($last ? 0 : 1)};
`

export const StepInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${Spacing.xs};
  flex-shrink: 0;
`

export type CircleState = 'done' | 'active' | 'inactive'

export const Circle = styled.button<{ $state: CircleState; $clickable: boolean }>`
  width: 3.6rem;
  height: 3.6rem;

  ${MOBILE} {
    width: 2.8rem;
    height: 2.8rem;
    font-size: ${FontSize.xxs};
  }

  ${TINY} {
    width: 2.4rem;
    height: 2.4rem;
    font-size: ${FontSize.xxs};
  }

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${FontFamily.heading};
  font-weight: ${FontWeight.bold};
  font-size: ${FontSize.sm};
  transition: all 0.2s;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  border: none;
  padding: 0;
  flex-shrink: 0;
  ${({ $state }) =>
    $state === 'done'
      ? `background: ${Colors.primaryDark}; color: ${Colors.white};`
      : $state === 'active'
        ? `background: ${Colors.primaryDark}; color: ${Colors.white}; box-shadow: 0 0 0 4px ${Colors.primaryLight};`
        : `background: ${Colors.white}; color: ${Colors.textSub}; border: 2px solid ${Colors.surfaceBorder};`}

  ${({ $state, $clickable }) =>
    $clickable && $state !== 'inactive'
      ? `&:hover { opacity: 0.85; }`
      : ''}
`

export const CheckIcon = styled(CheckOutlined)`
  font-size: ${FontSize.md};
`

export const LabelWrapper = styled.div`
  text-align: center;
`

export const StepLabel = styled.p<{ $active: boolean; $done: boolean }>`
  margin: 0;
  font-size: ${FontSize.sm};
  font-weight: ${({ $active }) => ($active ? FontWeight.semibold : FontWeight.regular)};
  color: ${({ $active, $done }) =>
    $active ? Colors.primaryDark : $done ? Colors.textMain : Colors.textSub};
  white-space: nowrap;

  ${MOBILE} {
    font-size: ${FontSize.xxs};
    white-space: normal;
    max-width: 7rem;
    text-align: center;
  }

  ${TINY} {
    max-width: 5.6rem;
    font-size: 0.9rem;
  }
`

export const StepSublabel = styled.p`
  margin: 0;
  font-size: ${FontSize.xxs};
  color: ${Colors.textSub};

  ${MOBILE} {
    display: none;
  }
`

export const Connector = styled.div<{ $done: boolean }>`
  flex: 1;
  height: 2px;
  margin-top: 1.7rem;
  background: ${({ $done }) => ($done ? Colors.primaryDark : Colors.surfaceBorder)};
  transition: background 0.2s;

  ${MOBILE} {
    margin-top: 1.3rem;
  }

  ${TINY} {
    margin-top: 1.1rem;
  }
`
