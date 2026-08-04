import React from 'react'
import { ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import App from './App'
import './i18n'

export default function AppWithProviders() {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: '#814efa',
          colorInfo: '#00fdcf',
          colorLink: '#814efa',
          colorTextLightSolid: '#ffffff',
          colorBgElevated: '#ffffff',
          colorBgContainer: '#ffffff',
          fontSize: 16,
          controlHeight: 48,
          borderRadius: 0,
          borderRadiusLG: 0,
          borderRadiusSM: 0,
          borderRadiusXS: 0,
        },
        components: {
          Card: {
            borderRadiusLG: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          },
          Button: {
            borderRadius: 100,
            borderRadiusLG: 100,
            borderRadiusSM: 100,
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
            controlHeight: 48,
            controlHeightLG: 56,
            fontSize: 16,
          },
          Select: {
            controlHeight: 48,
            controlHeightLG: 56,
            fontSize: 16,
          },
          DatePicker: {
            controlHeight: 48,
            fontSize: 16,
          },
          Popover: {
            colorBgElevated: '#ffffff',
          },
          Tooltip: {
            colorBgSpotlight: '#ffffff',
            colorTextLightSolid: '#222222',
          },
          Dropdown: {
            colorBgElevated: '#ffffff',
          },
          Table: {
            cellPaddingBlock: 14,
            cellPaddingInline: 16,
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  )
}
