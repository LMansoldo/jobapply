import { LinkedinOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import * as S from './ConnectPanel.styles'

interface ConnectPanelProps {
  isConnected: boolean
  onConnect: () => void
  onAnalyze: () => void
  onSwitchToPDF: () => void
}

export function ConnectPanel({ isConnected, onConnect, onAnalyze, onSwitchToPDF }: ConnectPanelProps) {
  const { t } = useTranslation()

  return (
    <div className={S.root}>
      <div className={S.card}>
        <LinkedinOutlined className={S.linkedinIcon} />

        {isConnected ? (
          <>
            <div className={S.connectedBadge}>
              <CheckCircleOutlined /> {t('tailoring.linkedinConnected')}
            </div>
            <p className={S.title}>{t('tailoring.linkedinReadyTitle')}</p>
            <p className={S.subtitle}>{t('tailoring.linkedinReadySubtitle')}</p>
            <button type="button" className={S.analyzeBtn} onClick={onAnalyze}>
              <ThunderboltOutlined /> {t('tailoring.linkedinAnalyzeNow')}
            </button>
          </>
        ) : (
          <>
            <p className={S.title}>{t('tailoring.linkedinConnectTitle')}</p>
            <p className={S.subtitle}>{t('tailoring.linkedinConnectSubtitle')}</p>
            <button type="button" className={S.connectBtn} onClick={onConnect}>
              <LinkedinOutlined /> {t('tailoring.linkedinConnectBtn')}
            </button>
            <div className={S.divider}>{t('common.or')}</div>
            <button type="button" className={S.pdfBtn} onClick={onSwitchToPDF}>
              {t('tailoring.linkedinUploadPDF')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
