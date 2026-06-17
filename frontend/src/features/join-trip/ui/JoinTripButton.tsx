import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "sonner";

import {useCancelTripMutation, useJoinTripMutation, useLeaveTripMutation} from "@/entities/trip/api/tripApi.ts";

import {Button} from "@/shared/ui/Button/Button.tsx";
import {useCurrentUser} from "@/features/auth/model/useCurrentUser.ts";
import type {Trip} from "@/entities/trip/model/types.ts";
import {ConfirmModal} from "@/shared/ui/Modal/ConfirmModal.tsx";

import styles from './JoinTripButton.module.css'

interface JoinTripButtonProps {
    trip: Trip;
}

export function JoinTripButton({trip}: JoinTripButtonProps) {
    const me = useCurrentUser();
    const navigate = useNavigate()
    const [join, {isLoading: joining}] = useJoinTripMutation()
    const [leave, {isLoading: leaving}] = useLeaveTripMutation();
    const [cancel, {isLoading: cancelling}] = useCancelTripMutation()

    const [confirmOpen, setConfirmOpen] = useState(false);
    if (!me) return null;

    const isDriver = trip.driver.id === me.id
    const isMember = trip.members.some(m => m.user.id === me.id)
    const seatsLeft = trip.seatsTotal - trip.members.length;

    const handleCancel = async () => {
        try {
            await cancel(trip.id).unwrap()
            toast.success('Поездка отменена')
            setConfirmOpen(false)
            navigate('/trips')
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Не удалось отменить')
        }
    }

    const handleJoin = async () => {
        try {
            await join(trip.id).unwrap()
            toast.success('Вы присоединились к поездке!');
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Не удалось присоединиться');
        }
    }

    const handleLeave = async () => {
        try {
            await leave(trip.id).unwrap();
            toast.success('Вы вышли из поездки');
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Не удалось выйти');
        }
    }

    const backButton = (
        <Link to="/trips">
            <Button>Назад</Button>
        </Link>
    );

    if (isDriver) {
        return (
            <div className={styles.wrapper_btn}>
                <Button variant="danger" onClick={() => setConfirmOpen(true)} disabled={cancelling}>
                    {cancelling ? 'Отменяем…' : 'Отменить поездку'}
                </Button>
                {backButton}

                <ConfirmModal
                    open={confirmOpen}
                    title="Отмена поездки"
                    confirmText="Да, отменить"
                    loading={cancelling}
                    onConfirm={handleCancel}
                    onClose={() => setConfirmOpen(false)}
                >
                    Вы точно хотите отменить эту поездку? Её больше не будет в списке.
                </ConfirmModal>
            </div>
        );
    }

    return (
        <div className={styles.wrapper_btn}>
            {isMember ? (
                    <Button onClick={handleLeave} disabled={leaving} variant={'danger'}>
                        {leaving ? 'Выходим…' : 'Выйти из поездки'}
                    </Button>)
                :
                (
                    <Button
                        onClick={handleJoin}
                        disabled={joining || seatsLeft <= 0}
                    >
                        {seatsLeft <= 0 ? 'Мест нет' : joining ? 'Присоединяемся…' : 'Присоединиться'}
                    </Button>
                )
            }
            {backButton}
        </div>
    )
}