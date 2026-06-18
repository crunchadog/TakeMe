import {useMemo, useState} from "react";
import {Link} from "react-router-dom";

import {TripCard} from "@/entities/trip/ui/TripCard.tsx";
import {useGetOfficesQuery} from "@/entities/office/api/officeApi.ts";
import {useGetTripsQuery} from "@/entities/trip/api/tripApi.ts";

import {Spinner} from "@/shared/ui/Spinner/Spinner.tsx";
import {Select} from "@/shared/ui/Select/Select.tsx";
import {Button} from "@/shared/ui/Button/Button.tsx";
import {MapView} from "@/shared/ui/Map/MapView.tsx";

import styles from './TripsPage.module.css'

type SortBy = 'date' | 'seats'

export function TripsPage() {
    const {data: trips, isLoading, isError} = useGetTripsQuery()
    const {data: offices} = useGetOfficesQuery()

    const [selectedOffice, setSelectedOffice] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<SortBy | null>(null)

    const visibleTrips = useMemo(() => {
        if (!trips) return []
        let result = [...trips]

        if (selectedOffice) {
            result = result.filter(item => item.office.id === selectedOffice)
        }

        result.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
            }

            const freeA = a.seatsTotal - a.members.length
            const freeB = b.seatsTotal - b.members.length
            return freeB - freeA
        })

        return result
    }, [trips, selectedOffice, sortBy])

    if (isLoading) return <Spinner/>;
    if (isError) return <p>Не удалось загрузить поездки</p>;

    const selected = offices?.find(office => office.id === selectedOffice)
    const mapCenter: [number, number] = selected
        ? [selected.lat, selected.lng]
        : offices && offices.length > 0
            ? [offices[0].lat, offices[0].lng]
            : [55.75, 37.62]

    const selectedOfficeName = selected?.name

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <h1 className={styles.title}>Поездки</h1>
                <Link to={'/trips/new'}>
                    <Button>Создать поездку</Button>
                </Link>
            </div>

            <div className={styles.controls}>
                <Select
                    label={'Сортировка'}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                >
                    <option value="data">По дате выезда</option>
                    <option value="seats">По свободным местам</option>
                </Select>

                {selectedOffice && (
                    <button className={styles.clearFilter} onClick={() => setSelectedOffice(null)}>
                        Офис: {selectedOfficeName} ✕
                    </button>
                )}
            </div>

            <div className={styles.columns}>
                <div className={styles.list}>
                    {visibleTrips.length > 0 ? (
                        visibleTrips.map((trip) => <TripCard key={trip.id} trip={trip}/>)
                    ) : (
                        <p className={styles.empty}>
                            {selectedOffice ? 'Нет поездок в этот офис' : 'Пока нет активных поездок'}
                        </p>
                    )}
                </div>

                <div className={styles.mapCol}>
                    <MapView
                        center={mapCenter}
                        zoom={selectedOffice ? 14 : 5}
                        height={500}
                        points={(offices ?? []).map((o) => ({
                            lat: o.lat,
                            lng: o.lng,
                            label: o.name + ' (' + o.city + ')',
                            color: o.id === selectedOffice ? '#e0a64f' : '#3a8a63',
                            onClick: () =>
                                setSelectedOffice((cur) => (cur === o.id ? null : o.id)),
                        }))}
                    />
                    <p className={styles.mapHint}>
                        Кликните по офису на карте, чтобы показать поездки только в него
                    </p>
                </div>
            </div>
        </div>
    );
}