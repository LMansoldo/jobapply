import type { Preview } from '@storybook/react'
import { ConfigProvider } from 'antd'
import { App as AntApp } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import '../src/index.css'
import '../src/i18n'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ConfigProvider>
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
