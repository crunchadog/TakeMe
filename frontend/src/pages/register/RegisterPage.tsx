import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "sonner";

import {useAppDispatch} from "@/shared/hooks/useAppDispatch.ts";
import {Input} from "@/shared/ui/Input/Input.tsx";
import {useRegisterMutation} from "@/features/auth/api/authApi.ts";

import {Button} from "@/shared/ui/Button/Button.tsx";
import {setToken} from "@/features/auth/model/authSlice.ts";

import styles from './RegisterPage.module.css'

export function RegisterPage() {
    const [form, setForm] = useState({
        email: "",
        name: "",
        password: "",
        organizationToken: "",
    })

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [register, {isLoading}] = useRegisterMutation();

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [field]: e.target.value,
        })
    }

    // function update(field:string) {
    //     return (e: React.ChangeEvent<HTMLInputElement>) => {
    //         setForm({
    //             ...form,
    //             [field]: e.target.value,
    //         })
    //     }
    // }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await register(form).unwrap()
            dispatch(setToken(res.access_token))
            toast.success('Аккаунт создан!')
            navigate('/trips')
        } catch (e) {
            toast.error(e?.data?.message ?? 'Не удалось зарегистрироваться')
        }
    }

    return (
        <div className={styles.page}>
            <form className={styles.card} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Take<span>Me</span></h1>
                <Input
                    id={'input_name'}
                    label={'Имя'}
                    value={form.name}
                    type='text'
                    onChange={update('name')}
                    required
                />
                <Input
                    id={'input_email'}
                    label={'Email'}
                    value={form.email}
                    type={'email'}
                    onChange={update('email')}
                    required
                />
                <Input
                    id={'input_password'}
                    label={'Пароль'}
                    value={form.password}
                    type={'password'}
                    onChange={update('password')}
                    required
                />
                <Input
                    id={'input_orgToken'}
                    label={"Токен организации"}
                    value={form.organizationToken}
                    type={'text'}
                    onChange={update('organizationToken')}
                    required
                />

                <Button type={'submit'} disabled={isLoading}>
                    {isLoading ? 'Создаем...' : 'Зарегистрироваться'}
                </Button>

                <p className={styles.hint}>
                    Уже есть аккаунт? <Link to={'/login'}>Войти</Link>
                </p>
            </form>
        </div>
    )
}