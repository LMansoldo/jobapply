import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { Spacing } from '../../../styles/theme/spacing'
import { FontSize, FontWeight } from '../../../styles/theme/typography'
import { BorderRadius } from '../../../styles/theme/radius'

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: ${Spacing.md} ${Spacing.md};
  width: 100%;
  box-sizing: border-box;

  .ant-pagination {
    font-size: ${FontSize.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: ${Spacing.xs};
    width: 100%;
    max-width: 100%;

    .ant-pagination-item {
      min-width: 2.8rem;
      height: 2.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: none;
      background: transparent;
      transition: all 0.2s ease;
      flex-shrink: 0;

      a {
        color: ${Colors.textSub};
        font-weight: ${FontWeight.medium};
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      &:hover {
        background: ${Colors.primaryLight};

        a {
          color: ${Colors.white};
        }
      }

      &.ant-pagination-item-active {
        background: ${Colors.primaryDark};

        a {
          color: ${Colors.white};
          font-weight: ${FontWeight.semibold};
        }
      }
    }

    .ant-pagination-prev,
    .ant-pagination-next {
      min-width: 2.8rem;
      height: 2.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: none;
      background: transparent;
      flex-shrink: 0;

      .ant-pagination-item-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: ${Colors.textSub};
        border-radius: 50%;
      }

      &:hover {
        background: ${Colors.primaryLight};

        .ant-pagination-item-link {
          color: ${Colors.white};
        }
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;

        &:hover {
          background: transparent;

          .ant-pagination-item-link {
            color: ${Colors.textSub};
          }
        }
      }
    }

    .ant-pagination-jump-prev,
    .ant-pagination-jump-next {
      min-width: 2.8rem;
      height: 2.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;

      .ant-pagination-item-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .ant-pagination-options {
      display: none; /* Remove dropdown de itens exibidos */
    }
  }
`
