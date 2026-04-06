import { useRef, useState } from 'react'
import { CameraOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { AvatarUploadProps } from './AvatarUpload.types'
import { styles } from './AvatarUpload.styles'

export function AvatarUpload({ value, onChange, name }: AvatarUploadProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [hovered, setHovered] = useState(false)

  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?'

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onChange) return
    const url = URL.createObjectURL(file)
    onChange(url)
  }

  return (
    <div style={styles.wrapper}>
      <div
        style={styles.avatar}
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {value ? <img src={value} alt={name} style={styles.img} /> : initials}
        <div style={{ ...styles.overlay, opacity: hovered ? 1 : 0 }}>
          <CameraOutlined />
        </div>
      </div>
      <span style={styles.hint}>{t('cv.uploadPhoto')}</span>
      <input ref={inputRef} type="file" accept="image/*" style={styles.input} onChange={handleFile} />
    </div>
  )
}
