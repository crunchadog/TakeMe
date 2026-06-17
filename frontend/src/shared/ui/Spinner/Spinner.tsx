import styles from './Spinner.module.css';

interface SpinnerProps {
    text?: string;
}
export const Spinner = ({text = 'Собираем все поездки вместе :)'}: SpinnerProps) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.spinner}/>
            <p className={styles.text}>{text}</p>
        </div>
    );
};

