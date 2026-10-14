import { ThemeProvider } from '@emotion/react'
import { App as AntApp, ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './../shared/i18n'
import { theme } from '../shared/theme'
import { queryClient } from '../state/query'
import { OverlayApp } from './OverlayApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: theme.colors.primaryDark,
          colorSuccess: theme.colors.success,
          colorWarning: theme.colors.warning,
          colorError: theme.colors.danger,
          colorInfo: theme.colors.info,
          colorBgBase: theme.colors.white,
          colorBgLayout: theme.colors.pageBg,
          colorBgContainer: theme.colors.white,
          colorBgElevated: theme.colors.white,
          colorTextBase: theme.colors.textMain,
          colorTextSecondary: theme.colors.textSub,
          colorTextLightSolid: theme.colors.white,
          colorBorder: theme.colors.surfaceBorder,
          fontFamily: theme.typography.family.body,
          fontSize: 16,
          controlHeight: 48,
          borderRadius: 14,
          borderRadiusSM: 8,
          borderRadiusLG: 16,
          borderRadiusXS: 0,
          boxShadow: theme.shadows.sm,
        },
        components: {
          Button: {
            colorPrimary: theme.colors.primaryDark,
            borderRadius: 9999,
            borderRadiusLG: 9999,
            borderRadiusSM: 9999,
            controlHeight: 48,
            controlHeightLG: 56,
            controlHeightSM: 40,
            fontSize: 16,
            fontSizeLG: 18,
            paddingInline: 24,
            paddingInlineLG: 32,
            contentFontSize: 16,
            onlyIconSize: 20,
          },
          Input: {
            colorBgContainer: theme.colors.surfacePage,
            borderRadius: 8,
            controlHeight: 48,
            controlHeightLG: 56,
            fontSize: 16,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 48,
            controlHeightLG: 56,
            fontSize: 16,
          },
          Card: {
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          },
        },
      }}
    >
      <AntApp>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <OverlayApp />
          </QueryClientProvider>
        </ThemeProvider>
      </AntApp>
    </ConfigProvider>
  </StrictMode>
)
