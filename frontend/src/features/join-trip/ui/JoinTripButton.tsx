import {Link} from "react-router-dom";
import {toast} from "sonner";

import {useJoinTripMutation, useLeaveTripMutation} from "@/entities/trip/api/tripApi.ts";

import {Button} from "@/shared/ui/Button/Button.tsx";
import {useCurrentUser} from "@/features/auth/model/useCurrentUser.ts";
import type {Trip} from "@/entities/trip/model/types.ts";

import styles from './JoinTripButton.module.css'

interface JoinTripButtonProps {
    trip: Trip;
}

export function JoinTripButton({trip}: JoinTripButtonProps) {
    const me = useCurrentUser();
    console.log(me)
    const [join, {isLoading: joining}] = useJoinTripMutation()
    const [leave, {isLoading: leaving}] = useLeaveTripMutation();

    if (!me) return null;

    const isDriver = trip.driver.id === me.id
    const isMember = trip.members.some(m => m.user.id === me.id)
    const seatsLeft = trip.seatsTotal - trip.members.length;

    const backButton = (
        <Link to="/trips">
            <Button>Назад</Button>
        </Link>
    );

    if (isDriver) {
        return (
            <div className={styles.wrapper_btn}>
                <p className={styles.driver}>Вы водитель этой поездки</p>
                {backButton}
            </div>
        );
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
            await leave(trip.id).unwrap()
            toast.success('Вы вышли из поездки');
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Не удалось выйти');
        }
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