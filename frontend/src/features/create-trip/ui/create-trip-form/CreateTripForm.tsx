import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

import {useGetOfficesQuery} from "@/entities/office/api/officeApi.ts";
import {useCreateTripMutation} from "@/entities/trip/api/tripApi.ts";

import {useGeolocation} from "@/shared/lib/useGeolocation.ts";
import {Select} from "@/shared/ui/Select/Select.tsx";
import {Button} from "@/shared/ui/Button/Button.tsx";
import {Input} from "@/shared/ui/Input/Input.tsx";

import {MapView} from "@/shared/ui/Map/MapView.tsx";
import {AddressAutocomplete} from "@/features/create-trip/ui/address-autocomplete/AddressAutocomplete.tsx";
import {reverseGeocode} from '@/shared/api/geocode.ts'
import styles from './CreateTripForm.module.css'

export function CreateTripForm() {
    const navigate = useNavigate()
    const {data: offices, isLoading: officesLoading} = useGetOfficesQuery()
    const [createTrip, {isLoading}] = useCreateTripMutation()
    const {getLocation, loading: geoLoading} = useGeolocation()

    const [form, setForm] = useState({
        officeId: '',
        startAddress: '',
        departureTime: '',
        seatsTotal: '3',
    })

    const [startPoint, setStartPoint] = useState<{ lat: number, lng: number } | null>(null)

    const update = (field: string) => (e: React.ChangeEvent<any>) => {
        setForm({
            ...form,
            [field]: e.target.value,
        })
    }

    const setPointWithAddress = async (lat: number, lng: number) => {
        setStartPoint({ lat, lng });
        try {
            const address = await reverseGeocode(lat, lng);
            if (address) {
                setForm((prev) => ({ ...prev, startAddress: address }));
            }
        } catch (err){
            console.log(err)
            throw new Error('Хм..')
        }
    };

    const handleMyLocation = async () => {
        try {
            const loc = await getLocation()
            await setPointWithAddress(loc.lat, loc.lng)
            toast.success("Местоположение определено")
        } catch (error) {
            toast.error(error.message ?? 'Не удалось определить местоположение')
        }
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!startPoint) {
            toast.error('Укажите точку старта на карте');
            return;
        }
        try {
            await createTrip({
                officeId: form.officeId,
                startLat: startPoint.lat,
                startLng: startPoint.lng,
                startAddress: form.startAddress,
                departureTime: new Date(form.departureTime).toISOString(),
                seatsTotal: Number(form.seatsTotal),
            }).unwrap()
            toast.success('Поездка создана!');
            navigate('/trips');
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Не удалось создать поездку');
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.title}>Новая поездка</h1>
            <Select
                label="Офис назначения"
                value={form.officeId}
                onChange={update('officeId')}
                required
            >
                <option value="" disabled>
                    {officesLoading ? 'Загрузка…' : 'Выберите офис'}
                </option>
                {offices?.map((o) => (
                    <option key={o.id} value={o.id}>
                        {o.name} ({o.city})
                    </option>
                ))}
            </Select>

            <AddressAutocomplete
                value={form.startAddress}
                onChange={(v) => setForm({...form, startAddress: v})}
                onSelect={(s) => setStartPoint({lat: s.lat, lng: s.lng})}/>

            <div className={styles.mapBlock}>
                <div className={styles.mapHead}>
                    <span className={styles.mapLabel}>Точка старта на карте</span>
                    <button
                        type="button"
                        className={styles.geoBtn}
                        onClick={handleMyLocation}
                        disabled={geoLoading}
                    >
                        {geoLoading ? 'Определяем…' : 'Моё местоположение'}
                    </button>
                </div>
                <MapView
                    center={startPoint ? [startPoint.lat, startPoint.lng] : [55.75056, 37.61750]}
                    zoom={startPoint ? 15 : 10}
                    points={startPoint ? [{lat: startPoint.lat, lng: startPoint.lng, label: 'Старт'}] : []}
                    onMapClick={(lat, lng) => setPointWithAddress(lat, lng)}
                    height={260}
                />
                <p className={styles.hint}>
                    {startPoint
                        ? `Точка выбрана: ${startPoint.lat.toFixed(4)}, ${startPoint.lng.toFixed(4)}`
                        : 'Кликните по карте, где будете забирать пассажиров'}
                </p>
            </div>

            <Input
                label="Время выезда"
                type="datetime-local"
                value={form.departureTime}
                onChange={update('departureTime')}
                required
            />

            <Input
                label="Мест для пассажиров"
                type="text"
                min="1"
                max="8"
                value={form.seatsTotal}
                onChange={update('seatsTotal')}
                required
            />

            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Создаём…' : 'Создать поездку'}
            </Button>
        </form>
    );
}