import {useParams} from "react-router-dom";

import {useGetTripQuery} from "@/entities/trip/api/tripApi.ts";
import Spinner from "@/shared/ui/Spinner/Spinner.tsx";
import {JoinTripButton} from "@/features/join-trip/ui/JoinTripButton.tsx";

import styles from './TripDetailsPage.module.css'
import {MapView} from "@/shared/ui/Map/MapView.tsx";
import {fetchRoute, type RouteResult} from "@/shared/api/osrm.ts";
import {useEffect, useState} from "react";

export function TripDetailsPage() {
    const {id} = useParams<{ id: string }>()
    const {data: trip, isLoading, isError} = useGetTripQuery(id!)

    const [route, setRoute] = useState<RouteResult | null>(null);
    const [routeError, setRouteError] = useState(false);

    useEffect(() => {
        if (!trip) return;
        setRoute(null);
        setRouteError(false);
        fetchRoute(
            { lat: trip.startLat, lng: trip.startLng },
            { lat: trip.office.lat, lng: trip.office.lng },
        )
            .then(setRoute)
            .catch(() => setRouteError(true));
    }, [trip]);


    if (isLoading) return <Spinner text={'Загрузка..'}/>
    if (isError || !trip) return <p>Поездка не найдена</p>;

    const time = new Date(trip.departureTime).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    });
    const seatsLeft = trip.seatsTotal - trip.members.length;

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>{trip.office.name}</h1>
            <p className={styles.muted}>
                {trip.office.city}, {trip.office.address}
            </p>

            <div className={styles.block}>
                <div><span className={styles.label}>Откуда:</span> {trip.startAddress}</div>
                <div><span className={styles.label}>Выезд:</span> {time}</div>
                <div><span className={styles.label}>Водитель:</span> {trip.driver.name}</div>
                <div><span className={styles.label}>Свободных мест:</span> {seatsLeft} из {trip.seatsTotal}</div>
            </div>

            <div className={styles.block}>
                <h2 className={styles.subtitle}>Пассажиры ({trip.members.length})</h2>
                {trip.members.length > 0 ? (
                    <ul className={styles.members}>
                        {trip.members.map((m) => (
                            <li key={m.user.id} className={styles.member}>
                <span className={styles.avatar}>
                  {m.user.name.charAt(0).toUpperCase()}
                </span>
                                {m.user.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.muted}>Пока никто не присоединился</p>
                )}
            </div>
            <div className={styles.block}>
                <h2 className={styles.subtitle}>Маршрут</h2>
                <MapView
                    center={[trip.startLat, trip.startLng]}
                    points={[
                        { lat: trip.startLat, lng: trip.startLng, label: 'Старт: ' + trip.startAddress },
                        { lat: trip.office.lat, lng: trip.office.lng, label: 'Офис: ' + trip.office.name },
                    ]}
                    route={route?.coordinates}
                    height={320}
                />
                {route && (
                    <p className={styles.routeInfo}>
                        ~{route.distanceKm.toFixed(1)} км · около {route.durationMin} мин в пути
                    </p>
                )}
                {routeError && (
                    <p className={styles.muted}>Не удалось построить маршрут</p>
                )}
            </div>
            <JoinTripButton trip={trip} />
        </div>
    );
}