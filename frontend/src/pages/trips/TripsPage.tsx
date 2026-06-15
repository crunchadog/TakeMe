import {useGetTripsQuery} from "@/entities/trip/api/tripApi.ts";
import {Link} from "react-router-dom";

import {Button} from "@/shared/ui/Button/Button.tsx";
import {TripCard} from "@/entities/trip/ui/TripCard.tsx";

import styles from './TripsPage.module.css'
import Spinner from "@/shared/ui/Spinner/Spinner.tsx";

export function TripsPage() {
    const {data: trips, isLoading, isError} = useGetTripsQuery()

    if (isLoading) return <Spinner />;
    if (isError) return <p>Не удалось загрузить поездки</p>;

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <h1 className={styles.title}>Поездки</h1>

                <Link to={'/trips/new'}>
                    <Button>Создать поездку</Button>
                </Link>
            </div>

            {trips && trips.length > 0 ? (
                <div className={styles.grid}>
                    {trips.map(trip => (
                        <TripCard key={trip.id} trip={trip}/>
                    ))}
                </div>
            ) : (
                <p className={styles.empty}>Пока нет активных поездок. Создай первую!</p>
            )}
        </div>
    )
}