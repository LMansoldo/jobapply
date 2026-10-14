import { useRef, useState } from 'react'
import { CameraOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { AvatarUploadProps } from './AvatarUpload.types'
import { Wrapper, Avatar, Img, Overlay, HiddenInput, Hint } from './AvatarUpload.styles'

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
    <Wrapper>
      <Avatar
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {value ? <Img src={value} alt={name} /> : initials}
        <Overlay $visible={hovered}>
          <CameraOutlined />
        </Overlay>
      </Avatar>
      <Hint>{t('cv.uploadPhoto')}</Hint>
      <HiddenInput ref={inputRef} type="file" accept="image/*" onChange={handleFile} />
    </Wrapper>
  )
}
