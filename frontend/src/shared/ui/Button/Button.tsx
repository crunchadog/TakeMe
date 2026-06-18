import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'small';
}

export function Button({ variant = 'primary', className, ...props }: Props) {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${className ?? ''}`}
            {...props}
        />
    );
}