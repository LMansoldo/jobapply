import type { ThemeConfig } from 'antd'
import { Colors } from './colors'
import { FontFamily } from './typography'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: Colors.primaryDark,
    colorSuccess: Colors.success,
    colorWarning: Colors.warning,
    colorError: Colors.danger,
    colorInfo: Colors.info,
    colorBgBase: Colors.white,
    colorBgLayout: Colors.pageBg,
    fontFamily: FontFamily.body,
    borderRadius: 14,
    borderRadiusSM: 8,
    borderRadiusLG: 16,
    colorBorder: Colors.surfaceBorder,
    colorTextBase: Colors.textMain,
    colorTextSecondary: Colors.textSub,
    boxShadow: '0 2px 16px rgba(124, 58, 237, 0.08)',
  },
  components: {
    Button: {
      colorPrimary: Colors.primaryDark,
      borderRadius: 9999,
    },
    Input: {
      colorBgContainer: Colors.surfacePage,
      borderRadius: 8,
    },
    Select: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 14,
    },
  },
}
