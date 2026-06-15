import type {SelectHTMLAttributes} from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

import styles from './Select.module.css'

export function Select({label, children, ...props}: Props) {
    return (
        <label className={styles.wrapper}>
            {label && <span className={styles.label}>{label}</span>}
            <select className={styles.select} {...props}>
                {children}
            </select>
        </label>
    )
}