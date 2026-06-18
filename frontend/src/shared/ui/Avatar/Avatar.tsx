import styles from './Avatar.module.css'

interface AvatarProps {
    name: string
    color?: string | null
    size?: number
}

export function Avatar({name, color, size = 36}: AvatarProps) {
    const letter = name?.charAt(0).toUpperCase() || '?'

    return (
        <span
        className={styles.avatar}
        style={{
            width: size,
            height: size,
            fontSize: size * 0.42,
            background: color || 'var(--color-info)',
        }}>
            {letter}
        </span>
    )
}