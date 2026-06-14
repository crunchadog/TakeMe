import {useAppDispatch} from "@/shared/hooks/useAppDispatch.ts";
import {NavLink, useNavigate} from "react-router-dom";

import styles from './Header.module.css'
import {logout} from "@/features/auth/model/authSlice.ts";
import {toast} from "sonner";

export function Header() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        toast.success('Вы вышли из аккаунта')
        navigate('/login')
    }

    return (
        <header className={styles.header}>
            <div className={styles.logo}>TakeMe</div>
            <nav className={styles.nav}>
                <NavLink
                    to={'/trips'}
                    className={styles.link}
                >
                    Поездки
                </NavLink>
            </nav>

            <button
                className={styles.logoutBtn}
                onClick={handleLogout}
            >
                Выйти
            </button>
        </header>
    )
}