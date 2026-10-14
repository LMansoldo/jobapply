import { useTranslation } from 'react-i18next'
import * as S from './TailoringEditorPanel.styles'

interface ExportDropdownMenuProps {
  onDownloadPDF?: () => void | Promise<void>
  onExportMarkdown?: () => void
}

export function ExportDropdownMenu({ onDownloadPDF, onExportMarkdown }: ExportDropdownMenuProps) {
  const { t } = useTranslation()

  return (
    <S.FileMenuDrop>
      <S.FileMenuList>
        <S.MenuItemRow
          onClick={(e) => { e.stopPropagation(); onDownloadPDF?.() }}
        >
          <span>{t('tailoring.downloadPDF')}</span>
        </S.MenuItemRow>
        <S.MenuItemRow
          onClick={(e) => { e.stopPropagation(); onExportMarkdown?.() }}
        >
          <span>{t('tailoring.exportMarkdown')}</span>
        </S.MenuItemRow>
      </S.FileMenuList>
    </S.FileMenuDrop>
  )
}
