import {NavLink, useNavigate} from "react-router-dom";
import {toast} from "sonner";

import {useCurrentUser} from "@/features/auth/model/useCurrentUser.ts";
import {useAppDispatch} from "@/shared/hooks/useAppDispatch.ts";

import {logout} from "@/features/auth/model/authSlice.ts";

import styles from './Sidebar.module.css'
import {Car, MapPlus} from "lucide-react";

export function Sidebar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const me = useCurrentUser()

    const linkClass = ({isActive}: { isActive: boolean }) => {
        return isActive ? `${styles.link} ${styles.linkActive}` : styles.link
    }

    const handleLogout = () => {
        dispatch(logout())
        toast.success('Вы вышли из аккаунта')
        navigate('/login')
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>Take<span>Me</span></div>

            <nav className={styles.nav}>
                <NavLink to="/trips" className={linkClass} end>
                    <Car width={18}/> <span>Поездки</span>
                </NavLink>
                <NavLink to="/trips/new" className={linkClass}>
                    <MapPlus width={18}/> <span>Создать</span>
                </NavLink>
            </nav>
            <div className={styles.bottom}>
                <NavLink to="/profile" className={styles.profile}>
          <span className={styles.avatar}>
            {me?.email?.charAt(0).toUpperCase() ?? '?'}
          </span>
                    <span className={styles.profileText}>
            <span className={styles.profileName}>Профиль</span>
            <span className={styles.profileSub}>Настройки</span>
          </span>
                </NavLink>
                <button className={styles.logout} onClick={handleLogout}>
                    Выйти
                </button>
            </div>
        </aside>
    )
}