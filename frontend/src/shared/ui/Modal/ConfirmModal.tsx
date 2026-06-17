import type {ReactNode} from "react";

import {Button} from "@/shared/ui/Button/Button.tsx";

import styles from './ConfirmModal.module.css'

interface ModalProps {
    open: boolean;
    title: string;
    children: ReactNode;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean
    onConfirm: () => void;
    onClose: () => void;
}

export function ConfirmModal({
                          open,
                          title,
                          children,
                          confirmText = 'Подтвердить',
                          cancelText = 'Отменить',
                          loading = false,
                          onConfirm,
                          onClose,
                      }: ModalProps) {
    if (!open) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.text}>{children}</div>
                <div className={styles.actions}>
                    <Button type="button" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button type="button" variant="danger" onClick={onConfirm} disabled={loading}>
                        {loading ? 'Подождите…' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}