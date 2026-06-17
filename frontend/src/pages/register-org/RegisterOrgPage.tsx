import {type ChangeEvent, type SubmitEvent, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {PartyPopper} from "lucide-react";
import {toast} from "sonner";

import {setToken} from "@/features/auth/model/authSlice";

import {useCreateOrganizationMutation} from "@/entities/organization/api/organizationApi.ts";

import {Button} from "@/shared/ui/Button/Button.tsx";
import {Input} from "@/shared/ui/Input/Input.tsx";
import {useAppDispatch} from "@/shared/hooks/useAppDispatch.ts";
import {getToken} from "@/shared/utils/getToken.ts";
import {CityAutocomplete} from "@/shared/ui/CityAutocomplete/CityAutocomplete.tsx";
import { baseApi } from "@/shared/api/baseApi";

import styles from './RegisterOrgPage.module.css'


export function RegisterOrgPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [createOrg, {isLoading}] = useCreateOrganizationMutation()

    const [form, setForm] = useState({
        organizationName: "",
        inviteToken: "",
        name: "",
        email: "",
        password: "",
        city: "",
    })

    const [createdToken, setCreatedToken] = useState<string | null>(null)

    const update = (field: string) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            setForm({
                ...form,
                [field]: e.target.value
            })
        }
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await createOrg(form).unwrap()
            setCreatedToken(res.inviteToken)
            dispatch(setToken(res.access_token))
            dispatch(baseApi.util.resetApiState())
            toast.success('Организация создана!')
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Не удалось создать организацию');
        }
    }

    const copyToken = () => {
        if (createdToken) {
            navigator.clipboard.writeText(createdToken)
            toast.success('Токен скопирован')
        }
    }

    if (createdToken) {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Готово! <PartyPopper /></h1>
                    <p className={styles.text}>
                        Ваша организация создана. Раздайте этот токен сотрудникам,
                        чтобы они зарегистрировались в вашей компании:
                    </p>
                    <div className={styles.tokenBox}>
                        <span className={styles.token}>{createdToken}</span>
                        <button type="button" className={styles.copyBtn} onClick={copyToken}>
                            Скопировать
                        </button>
                    </div>
                    <Button onClick={() => navigate('/offices')}>
                        Перейти к настройке офисов
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <form className={styles.card} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Создание организации</h1>

                <Input
                    label="Название компании"
                    value={form.organizationName}
                    onChange={update('organizationName')}
                    required
                />

                <div className={styles.tokenField}>
                    <Input
                        label="Токен организации"
                        value={form.inviteToken}
                        onChange={update('inviteToken')}
                        placeholder="Свой или сгенерировать"
                    />
                    <button
                        type="button"
                        className={styles.genBtn}
                        onClick={() => setForm({...form, inviteToken: getToken()})}
                    >
                        Сгенерировать
                    </button>
                </div>

                <div className={styles.divider}>Данные управляющего</div>

                <Input
                    label="Ваше имя"
                    value={form.name}
                    onChange={update('name')}
                    required/>
                <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={update('email')} required/>
                <Input
                    label="Пароль"
                    type="password"
                    value={form.password}
                    onChange={update('password')} required/>

                <CityAutocomplete
                    value={form.city}
                    onChange={(city) => setForm({ ...form, city })}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Создаём…' : 'Создать организацию'}
                </Button>
                <p className={styles.hint}>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </form>
        </div>
    );
}