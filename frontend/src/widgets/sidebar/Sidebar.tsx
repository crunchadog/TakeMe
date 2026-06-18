import {NavLink, useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {Building2, Car, MapPlus} from "lucide-react";

import {logout} from "@/features/auth/model/authSlice.ts";

import {useGetMeQuery} from "@/entities/users/api/usersApi.ts";

import {useAppDispatch} from "@/shared/hooks/useAppDispatch.ts";
import {baseApi} from "@/shared/api/baseApi.ts";
import {Avatar} from "@/shared/ui/Avatar/Avatar.tsx";

import styles from './Sidebar.module.css'

export function Sidebar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { data: me } = useGetMeQuery();

    const linkClass = ({isActive}: { isActive: boolean }) => {
        return isActive ? `${styles.link} ${styles.linkActive}` : styles.link
    }

    const handleLogout = () => {
        dispatch(logout())
        dispatch(baseApi.util.resetApiState())
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

                {me?.role === 'ADMIN' && (
                    <NavLink to="/offices" className={linkClass}>
                        <Building2 width={17}/> <span>Офисы</span>
                    </NavLink>
                )}
            </nav>
            <div className={styles.bottom}>
                <NavLink to="/profile" className={styles.profile}>
                    <Avatar name={me?.name ?? me?.email ?? '?'} color={me?.avatarColor} size={34} />
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