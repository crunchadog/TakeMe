import {useEffect, useState} from "react";
import {toast} from "sonner";

import {AddressAutocomplete} from "@/features/create-trip/ui/address-autocomplete/AddressAutocomplete.tsx";

import {useGetMeQuery, useUpdateMeMutation} from "@/entities/users/api/usersApi.ts";

import {Avatar} from "@/shared/ui/Avatar/Avatar.tsx";
import {Input} from "@/shared/ui/Input/Input.tsx";
import {CityAutocomplete} from "@/shared/ui/CityAutocomplete/CityAutocomplete.tsx";
import {Button} from "@/shared/ui/Button/Button.tsx";

import styles from './ProflePage.module.css'
import {Edit} from "lucide-react";

const COLORS = ['#4f7fd1', '#e0a64f', '#3a8a63', '#c2533f', '#7c6fc7', '#0ea5e9']

export function ProfilePage() {
    const {data: me} = useGetMeQuery()
    const [updateMe, {isLoading: updating}] = useUpdateMeMutation()

    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [isCityEditing, setIsCityEditing] = useState(false)
    const [homeAddress, setHomeAddress] = useState('')
    const [home, setHome] = useState<{ lat: number, lng: number } | null>(null)
    const [color, setColor] = useState('#4f7fd1')

    const handleSave = async () => {
        try {
            await updateMe({
                name,
                city,
                homeAddress,
                ...(home && {homeLat: home.lat, homeLng: home.lng}),
                avatarColor: color,
            }).unwrap()

            toast.success("Профиль успешно сохранен!");
            if (city) setIsCityEditing(false);
        } catch {
            toast.error("Ошибка при сохранении");
        }
    }
    useEffect(() => {
        if (me) {
            setName(me.name)
            setCity(me.city ?? '')
            setHomeAddress(me.homeAddress ?? '')
            setColor(me.avatarColor ?? "#4f7fd1")

            setIsCityEditing(!me.city);
            if (me.homeLat && me.homeLng) {
                setHome({lat: me.homeLat, lng: me.homeLng})
            }
        }
    }, [me]);

    if (!me) return <p>Загрузка..</p>

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Профиль</h1>

            <div className={styles.head}>
                <Avatar name={name} color={color} size={72}/>
                <div>
                    <div className={styles.email}>{me.email}</div>
                    <div className={styles.role}>
                        {me.role === 'ADMIN' ? "Управляющий" : "Сотрудник"}
                        {me.organization && ` · ${me.organization.name}`}
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <Input
                    label={'Имя'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className={styles.field}>
                    <span className={styles.label}>Цвет аватарки</span>
                    <div className={styles.colors}>
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={`${styles.color} ${color === c ? styles.colorActive : ''}`}
                                style={{background: c}}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.field}>
                    <span className={styles.label}>Город</span>
                    {isCityEditing ? (
                        <CityAutocomplete label={null} value={city} onChange={setCity}/>
                    ) : (
                        <div className={styles.cityValueRow}>
                            <span>{city || 'Не указан'}</span>
                            <Button variant={'small'} className={styles.changeButton}
                                    onClick={() => setIsCityEditing(true)}>
                                <Edit width={14}/>
                            </Button>
                        </div>
                    )}
                </div>

                <div className={styles.field}>
                    <span className={styles.label}>Домашний адрес (для расчета времени выхода)</span>
                    <AddressAutocomplete
                        label={'Дом'}
                        value={homeAddress}
                        onChange={setHomeAddress}
                        onSelect={(s) => {
                            setHome({lat: s.lat, lng: s.lng})
                            setHomeAddress(s.label)
                        }}/>
                </div>

                <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={updating}
                >
                    {updating ? 'Сохраняем...' : 'Сохранить'}
                </button>
            </div>
        </div>
    )
}
