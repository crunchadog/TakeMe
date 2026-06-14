import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "sonner";

import {useLoginMutation} from '@/features/auth/api/authApi';
import {useAppDispatch} from "@/shared/hooks/useAppDispatch.ts";

import {Input} from "@/shared/ui/Input/Input.tsx";
import {Button} from "@/shared/ui/Button/Button.tsx";
import {setToken} from "@/features/auth/model/authSlice.ts";

import styles from './LoginPage.module.css'

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [login, {isLoading}] = useLoginMutation()

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await login({email, password}).unwrap()
            dispatch(setToken(res.access_token))
            toast.success('С возвращением!')
            navigate('/trips')
        } catch (e) {
            toast.error(e?.data?.message ?? 'Не удалось войти')
        }
    }
    return (
        <div className={styles.page}>
            <form className={styles.card} onSubmit={handleSubmit}>
                <Input
                    id={'input_email'}
                    label='Email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    id={'input_password'}
                    label='Пароль'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button
                    type={'submit'}
                    disabled={isLoading}
                >
                    {isLoading ? 'Входим...' : 'Войти'}
                </Button>

                <p className={styles.hint}>
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </form>
        </div>
    )
}