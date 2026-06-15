import type {Trip} from "@/entities/trip/model/types.ts";
import {Link} from "react-router-dom";

import styles from './TripCard.module.css'

interface TripCardProp {
    trip: Trip
}

export function TripCard({trip}: TripCardProp) {
    const seatsLeft = trip.seatsTotal - trip.members.length;
    const time = new Date(trip.departureTime).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <Link to={`/trips/${trip.id}`} className={styles.card}>
            <div className={styles.office}>{trip.office.name}</div>
            <div className={styles.row}>
                <span className={styles.muted}>Откуда:</span> {trip.startAddress}
            </div>
            <div className={styles.row}>
                <span className={styles.muted}>Выезд:</span> {time}
            </div>

            <div className={styles.footer}>
                <span>Водитель: {trip.driver.name}</span>
                <span className={seatsLeft > 0 ? styles.seats : styles.seatsFull}>
                    {seatsLeft > 0 ? `Мест: ${seatsLeft}` : 'Мест нет'}
                </span>
            </div>
        </Link>
    )
}