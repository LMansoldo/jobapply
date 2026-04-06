import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import App from './App'
import './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          // Cores
          colorPrimary: '#814efa',
          colorInfo: '#00fdcf',
          colorLink: '#814efa',
          // Texto branco sobre fundo roxo
          colorTextLightSolid: '#ffffff',
          // Fundo de popovers, dropdowns, tooltips
          colorBgElevated: '#ffffff',
          colorBgContainer: '#ffffff',
          // Tamanho base
          fontSize: 16,
          controlHeight: 48,
          // Sem border radius nos containers
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
            // Oval / pill
            borderRadius: 100,
            borderRadiusLG: 100,
            borderRadiusSM: 100,
            // Extra grande
            controlHeight: 48,
            controlHeightLG: 56,
            controlHeightSM: 40,
            fontSize: 16,
            fontSizeLG: 18,
            paddingInline: 24,
            paddingInlineLG: 32,
            // Centraliza conteúdo interno
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
  </React.StrictMode>,
)
