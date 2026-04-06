import type { ScoreRingProps } from './ScoreRing.types'
import { styles } from './ScoreRing.styles'

export function ScoreRing({ value, size = 120, label, sublabel }: ScoreRingProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference
  const gradientId = `scoreRingGrad-${size}`

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.svgWrapper, width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f0abfc" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={8}
            style={styles.track}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={8}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={styles.textGroup}>
          <span style={{ ...styles.value, fontSize: size > 100 ? '2.4rem' : '1.8rem' }}>
            {clamped}
          </span>
          {sublabel && <span style={styles.sublabel}>{sublabel}</span>}
        </div>
      </div>
      {label && <span style={styles.label}>{label}</span>}
    </div>
  )
}
