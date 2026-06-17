import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

import {useGetTripQuery} from "@/entities/trip/api/tripApi.ts";
import {useGetMeQuery} from "@/entities/users/api/usersApi.ts";

import {Spinner} from "@/shared/ui/Spinner/Spinner.tsx";
import {MapView} from "@/shared/ui/Map/MapView.tsx";
import {fetchRoute, type RouteResult} from "@/shared/api/osrm.ts";

import {JoinTripButton} from "@/features/join-trip/ui/JoinTripButton.tsx";

import styles from './TripDetailsPage.module.css'

export function TripDetailsPage() {
    const {id} = useParams<{ id: string }>()
    const {data: trip, isLoading, isError} = useGetTripQuery(id!)

    const [route, setRoute] = useState<RouteResult | null>(null);
    const [routeError, setRouteError] = useState(false);

    const {data: me} = useGetMeQuery()
    const [walk, setWalk] = useState<{ durationMin: number } | null>(null)
    const [walkRoute, setWalkRoute] = useState<RouteResult | null>(null)

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

    useEffect(() => {
        if (!trip || !me?.homeLat || !me?.homeLng) return;
        fetchRoute(
            { lat: me.homeLat, lng: me.homeLng },
            { lat: trip.startLat, lng: trip.startLng },
            'foot',
        )
            .then((r) => {
                setWalkRoute(r)
                setWalk({ durationMin: r.durationMin })
            })
            .catch(() => {
                setWalkRoute(null)
                setWalk(null)
            });
    }, [trip, me]);

    const leaveBy =
        walk && trip
            ? new Date(new Date(trip.departureTime).getTime() - walk.durationMin * 60000)
            : null;

    if (isLoading) return <Spinner text={'Загрузка..'}/>
    if (isError || !trip) return <p>Поездка не найдена</p>;

    const time = new Date(trip.departureTime).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    });
    const seatsLeft = trip.seatsTotal - trip.members.length;

    const isDriver = !!me && !!trip && trip.driver.id === me.id

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>{trip.office.name}</h1>
            <p className={styles.muted}>
                {trip.office.city}, {trip.office.address}
            </p>

            <div className={styles.columns}>
                <div className={styles.left}>
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
                                        <span className={styles.avatar}>{m.user.name.charAt(0).toUpperCase()}</span>
                                        {m.user.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.muted}>Пока никто не присоединился</p>
                        )}
                    </div>

                    <JoinTripButton trip={trip} />
                </div>

                <div className={styles.right}>
                    <div className={styles.block}>
                        <h2 className={styles.subtitle}>
                            {isDriver ? 'Ваш маршрут до офиса' : 'Как добраться до точки сбора'}
                        </h2>

                        {isDriver ? (
                            <>
                                <MapView
                                    center={[trip.startLat, trip.startLng]}
                                    points={[
                                        { lat: trip.startLat, lng: trip.startLng, label: 'Старт: ' + trip.startAddress, color: '#4f7fd1' },
                                        { lat: trip.office.lat, lng: trip.office.lng, label: 'Офис: ' + trip.office.name, color: '#3a8a63' },
                                    ]}
                                    route={route?.coordinates}
                                    routeColor="#4f7fd1"
                                    height={380}
                                />
                                {route && (
                                    <p className={styles.routeInfo}>
                                        ~{route.distanceKm.toFixed(1)} км · около {route.durationMin} мин в пути
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <MapView
                                    center={[trip.startLat, trip.startLng]}
                                    points={[
                                        ...(me?.homeLat && me?.homeLng
                                            ? [{ lat: me.homeLat, lng: me.homeLng, label: 'Ваш дом', color: '#e0a64f' }]
                                            : []),
                                        { lat: trip.startLat, lng: trip.startLng, label: 'Точка сбора: ' + trip.startAddress, color: '#4f7fd1' },
                                    ]}
                                    route={walkRoute?.coordinates}
                                    routeColor="#e0a64f"
                                    height={380}
                                />
                                {me && !me.homeLat && (
                                    <p className={styles.muted}>
                                        Укажите домашний адрес в профиле, чтобы построить маршрут
                                    </p>
                                )}
                                {walk && leaveBy && (
                                    <div className={styles.walkInfo}>
                                        Пешком до точки сбора: ~{walk.durationMin} мин. Выйти не позже{' '}
                                        <b>{leaveBy.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</b>
                                    </div>
                                )}
                            </>
                        )}
                        {routeError && <p className={styles.muted}>Не удалось построить маршрут</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}