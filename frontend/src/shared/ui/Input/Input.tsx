import type {InputHTMLAttributes} from "react";

import styles from './Input.module.css'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

export function Input({label, ...props}: Props) {
    return (
        <label className={styles.wrapper}>
            {label && <span className={styles.label}>{label}</span>}
            <input className={styles.input} {...props} />
        </label>
    )
}