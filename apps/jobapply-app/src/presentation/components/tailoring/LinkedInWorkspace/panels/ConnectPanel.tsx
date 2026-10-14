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
    <S.Root>
      <S.Card>
        <S.LinkedinIcon />

        {isConnected ? (
          <>
            <S.ConnectedBadge>
              <CheckCircleOutlined /> {t('tailoring.linkedinConnected')}
            </S.ConnectedBadge>
            <S.Title>{t('tailoring.linkedinReadyTitle')}</S.Title>
            <S.Subtitle>{t('tailoring.linkedinReadySubtitle')}</S.Subtitle>
            <S.AnalyzeBtn type="button" onClick={onAnalyze}>
              <ThunderboltOutlined /> {t('tailoring.linkedinAnalyzeNow')}
            </S.AnalyzeBtn>
          </>
        ) : (
          <>
            <S.Title>{t('tailoring.linkedinConnectTitle')}</S.Title>
            <S.Subtitle>{t('tailoring.linkedinConnectSubtitle')}</S.Subtitle>
            <S.ConnectBtn type="button" onClick={onConnect}>
              <LinkedinOutlined /> {t('tailoring.linkedinConnectBtn')}
            </S.ConnectBtn>
            <S.Divider>{t('common.or')}</S.Divider>
            <S.PdfBtn type="button" onClick={onSwitchToPDF}>
              {t('tailoring.linkedinUploadPDF')}
            </S.PdfBtn>
          </>
        )}
      </S.Card>
    </S.Root>
  )
}
