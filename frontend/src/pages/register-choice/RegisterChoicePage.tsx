import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import styles from './RegisterChoicePage.module.css';

export function RegisterChoicePage() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Как вы будете пользоваться Take<span>Me</span>?</h1>
            <div className={styles.cards}>
                <motion.button
                    className={styles.card}
                    onClick={() => navigate('/register')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className={styles.cardTitle}>Сотрудник</span>
                    <span className={styles.cardDesc}>
            Ищу и предлагаю поездки в офис своей компании
          </span>
                </motion.button>

                <motion.button
                    className={`${styles.card} ${styles.cardAlt}`}
                    onClick={() => navigate('/register-org')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className={styles.cardTitle}>Управляющий</span>
                    <span className={styles.cardDesc}>
            Создаю компанию и настраиваю офисы на карте
          </span>
                </motion.button>
            </div>
            <p className={styles.hint}>
                Уже есть аккаунт? <a onClick={() => navigate('/login')} className={styles.link}>Войти</a>
            </p>
        </div>
    );
}