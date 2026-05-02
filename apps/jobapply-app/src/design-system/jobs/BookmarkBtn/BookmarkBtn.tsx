import { BookOutlined, BookFilled } from '@ant-design/icons'
import type { BookmarkBtnProps } from './BookmarkBtn.types'
import { styles } from './BookmarkBtn.styles'

export function BookmarkBtn({ saved, onToggle }: BookmarkBtnProps) {
  return (
    <button
      type="button"
      style={{
        ...styles.btn,
        ...(saved ? styles.btnSaved : styles.btnUnsaved),
      }}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      aria-label={saved ? 'Remover dos salvos' : 'Salvar vaga'}
    >
      {saved ? <BookFilled /> : <BookOutlined />}
    </button>
  )
}
