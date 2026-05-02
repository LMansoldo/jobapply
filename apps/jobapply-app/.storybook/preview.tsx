import type { Preview } from '@storybook/react'
import { ConfigProvider, App as AntApp } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import '../src/index.css'
import '../src/i18n'
import { antdTheme } from '../src/styles/theme/antdTheme'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ConfigProvider theme={antdTheme}>
        <AntApp>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
