import styled from '@emotion/styled'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.pageBg};

  @media ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

export const LeftPanel = styled.div`
  display: none;

  @media ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    flex: 0 0 45%;
    background: ${({ theme }) => theme.colors.gradientHeroDark};
    padding: ${({ theme }) => theme.spacing.xxl};
    flex-direction: column;
    justify-content: center;
    box-shadow: ${({ theme }) => theme.shadows.auth};
    overflow: hidden;
    position: relative;
  }
`

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
  min-height: 100vh;

  @media ${({ theme }) => theme.mediaQueries.md} {
    padding: ${({ theme }) => theme.spacing.xxl};
    min-height: auto;
  }
`

export const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1.6rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  width: 100%;
  max-width: 42rem;

  @media ${({ theme }) => theme.mediaQueries.md} {
    padding: ${({ theme }) => theme.spacing.xxl};
  }
`
