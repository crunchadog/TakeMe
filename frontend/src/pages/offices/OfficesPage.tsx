import {type SubmitEvent, useState} from "react";
import {Link} from "react-router-dom";
import {toast} from "sonner";
import {ArrowRight, Clipboard} from "lucide-react";

import {useGetMeQuery} from "@/entities/users/api/usersApi.ts";
import {useCreateOfficeMutation, useDeleteOfficeMutation, useGetOfficesQuery} from "@/entities/office/api/officeApi.ts";

import {AddressAutocomplete} from "@/features/create-trip/ui/address-autocomplete/AddressAutocomplete.tsx";

import {Input} from "@/shared/ui/Input/Input.tsx";
import {CityAutocomplete} from "@/shared/ui/CityAutocomplete/CityAutocomplete.tsx";
import {MapView} from "@/shared/ui/Map/MapView.tsx";
import {Button} from "@/shared/ui/Button/Button.tsx";
import {reverseGeocode} from "@/shared/api/geocode";
import {ConfirmModal} from "@/shared/ui/Modal/ConfirmModal.tsx";

import styles from './OfficesPage.module.css'

export function OfficesPage() {
    const {data: me} = useGetMeQuery()
    const {data: offices} = useGetOfficesQuery()

    const [createOffice, {isLoading}] = useCreateOfficeMutation()
    const [deleteOffice, {isLoading: deleteLoading}] = useDeleteOfficeMutation()

    const [form, setForm] = useState({
        name: '',
        address: '',
        city: '',
    })

    const [point, setPoint] = useState<{ lat: number, lng: number } | null>(null)
    const [mapCenter, setMapCenter] = useState<[number, number]>([55.75, 37.62]);

    const [officeToDelete, setOfficeToDelete] = useState<{ id: string; name: string } | null>(null);

    const isAdmin = me?.role === 'ADMIN';

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!point) {
            toast.error('Укажите точку офиса на карте')
            return
        }

        if (!form.city) {
            toast.error('Укажите город')
            return;
        }

        try {
            await createOffice({
                name: form.name,
                address: form.address,
                city: form.city,
                lat: point.lat,
                lng: point.lng,
            }).unwrap()
            toast.success('Офис добавлен!')
            setForm({name: '', address: '', city: ''})
            setPoint(null)
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Не удалось создать офис')
        }
    }

    const openDeleteModal = (id: string, name: string) => {
        setOfficeToDelete({id, name});
    };

    const closeDeleteModal = () => {
        setOfficeToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!officeToDelete) return;
        try {
            await deleteOffice(officeToDelete.id).unwrap()
            toast.success('Офис удалён')
            closeDeleteModal();
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Не удалось удалить')
        }
    }

    const setPointWithAddress = async (lat: number, lng: number) => {
        setPoint({lat, lng});
        setMapCenter([lat, lng])
        try {
            const address = await reverseGeocode(lat, lng);
            if (address) {
                setForm((prev) =>
                    (
                        {...prev, address}
                    ));
            }
        } catch {
        }
    };

    const copyToken = () => {
        if (me?.organization?.inviteToken) {
            navigator.clipboard.writeText(me.organization.inviteToken)
            toast.success('Токен скопирован')
        }
    }

    if (!isAdmin) {
        return (
            <>
                <p>Эта страница доступна только управляющему организации.</p>
                <Link to={'/trips'}>Вернуться</Link>
            </>
        );
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Офисы компании</h1>

            {me?.organization && (
                <div className={styles.tokenBox}>
                    <div>
                        <span className={styles.muted}>Токен для сотрудников:</span>{' '}
                        <span className={styles.token}>{me.organization.inviteToken}</span>
                    </div>
                    <button className={styles.copyBtn} onClick={copyToken}><Clipboard/></button>
                </div>
            )}

            <div className={styles.columns}>
                <div className={styles.list}>
                    <h2 className={styles.subtitle}>Ваших офисов: {offices?.length ?? 0}</h2>
                    {offices && offices.length > 0 ? (
                        offices.map((office) => (
                            <div key={office.id} className={styles.officeCard}>
                                <div>
                                    <div className={styles.officeName}>{office.name}</div>
                                    <div className={styles.muted}>{office.city}, {office.address}</div>
                                </div>

                                <button
                                    className={styles.delBtn}
                                    onClick={() => openDeleteModal(office.id, office.name)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className={styles.muted}>Офисов пока нет. Добавьте первый <ArrowRight/></p>
                    )}
                </div>

              <ConfirmModal
                  open={!!officeToDelete}
                  title={'Удаление офиса'}
                  confirmText={'Да, удалить'}
                  loading={deleteLoading}
                  onConfirm={handleConfirmDelete}
                  onClose={closeDeleteModal}
              >
                  Вы точно хотите удалить офис <strong>«{officeToDelete?.name}»</strong>?
              </ConfirmModal>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2>Новый офис</h2>

                    <Input
                        label={"Название"}
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        required
                    />

                    <AddressAutocomplete
                        label={'Адрес'}
                        value={form.address}
                        onChange={(value) => setForm({...form, address: value})}
                        onSelect={(select) => setPoint({lat: select.lat, lng: select.lng})}
                    />

                    <CityAutocomplete
                        value={form.city}
                        onChange={(city) => setForm({...form, city})}
                    />

                    <MapView
                        center={mapCenter}
                        zoom={point ? 15 : 9}
                        points={point ? [{lat: point.lat, lng: point.lng, label: 'Офис'}] : []}
                        onMapClick={(lat, lng) => setPointWithAddress(lat, lng)}
                        height={300}
                    />
                    <p className={styles.hint}>
                        {point ? `Точка: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}` : 'Выберите адрес или кликните по карте'}
                    </p>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Добавляем…' : 'Добавить офис'}
                    </Button>
                </form>
            </div>
        </div>
    )
}