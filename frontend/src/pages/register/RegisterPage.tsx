import {type SubmitEvent, type ChangeEvent, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "sonner";

import {useRegisterMutation} from "@/features/auth/api/authApi.ts";
import {setToken} from "@/features/auth/model/authSlice.ts";

import {useLazyGetCitiesByTokenQuery} from "@/entities/organization/api/organizationApi.ts";

import {useAppDispatch} from "@/shared/hooks/useAppDispatch.ts";
import {Input} from "@/shared/ui/Input/Input.tsx";
import {Button} from "@/shared/ui/Button/Button.tsx";
import {useDebounce} from "@/shared/lib/useDebounce.ts";
import { Select } from "@/shared/ui/Select/Select";

import styles from './RegisterPage.module.css'

export function RegisterPage() {
    const [form, setForm] = useState({
        email: "",
        name: "",
        password: "",
        organizationToken: "",
        city: "",
    })

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [register, {isLoading}] = useRegisterMutation();
    const [getCities, {data: cities}] = useLazyGetCitiesByTokenQuery();

    const debouncedToken = useDebounce(form.organizationToken, 600)

    useEffect(() => {
        if (debouncedToken.trim().length >= 3) {
            getCities(debouncedToken.trim());
        }
    }, [debouncedToken, getCities]);

    const update = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [field]: e.target.value,
        })
    }

    // function update(field:string) {
    //     return (e: ChangeEvent<HTMLInputElement>) => {
    //         setForm({
    //             ...form,
    //             [field]: e.target.value,
    //         })
    //     }
    // }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.city) {
            toast.error('Укажите город');
            return;
        }
        try {
            const res = await register(form).unwrap();
            dispatch(setToken(res.access_token));
            toast.success('Аккаунт создан!');
            navigate('/trips');
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Не удалось зарегистрироваться');
        }
    }

    const hasCities = cities && cities.length > 0;

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

                {hasCities ? (
                    <Select label="Город" value={form.city} onChange={update('city')} required>
                        <option value="" disabled>Выберите город</option>
                        {cities!.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </Select>
                ) : (
                    <Input
                        label="Город"
                        value={form.city}
                        onChange={update('city')}
                        placeholder={debouncedToken ? 'Введите ваш город' : 'Сначала введите токен'}
                        disabled={form.organizationToken.trim().length === 0}
                        required
                    />
                )}

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Создаем...' : 'Зарегистрироваться'}
                </Button>
                <p className={styles.hint}>
                    Уже есть аккаунт? <Link to={'/login'}>Войти</Link>
                </p>
            </form>
        </div>
    )
}