import {MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents, ZoomControl} from "react-leaflet";
import {useEffect, useMemo} from 'react'

import {createColoredIcon} from "@/shared/lib/leaflet-icon.ts";

import styles from './MapView.module.css'

const defaultColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#4f7fd1'

export interface MapPoint {
    lat: number;
    lng: number;
    label?: string;
    color?: string;
    onClick?: () => void;
}

interface Props {
    center: [number, number];
    zoom?: number;
    points?: MapPoint[];
    route?: [number, number][];
    routeColor?: string;
    height?: number;
    onMapClick?: (lat: number, lng: number) => void;
}

function ClickHandler({onClick}: { onClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => onClick(e.latlng.lat, e.latlng.lng),
    })

    return null;
}

function Recenter({center, zoom}: { center: [number, number], zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, zoom, {
            animate: true,
            duration: 2,
        })
    }, [center[0], center[1], zoom, map]);

    return null
}

export function MapView({
                            center,
                            zoom = 13,
                            points = [],
                            route,
                            routeColor = defaultColor,
                            height = 300,
                            onMapClick,
                        }: Props) {
    const icons = useMemo(() => {
        const map: Record<string, ReturnType<typeof createColoredIcon>> = {};

        points.forEach((point) => {
            const c = point.color ?? defaultColor
            if (!map[c]) map[c] = createColoredIcon(c)
        })

        return map
    }, [points])

    return (
        <div className={styles.wrapper} style={{height}}>
            <MapContainer
                center={center}
                zoom={zoom}
                className={styles.map}
                zoomControl={false}>
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position={'bottomright'}/>

                <Recenter center={center} zoom={zoom}/>
                {onMapClick && <ClickHandler onClick={onMapClick}/>}
                {points.map((point, i) => (
                    <Marker
                        key={i}
                        position={[point.lat, point.lng]}
                        icon={icons[point.color ?? defaultColor]}
                        eventHandlers={point.onClick ? { click: point.onClick} : undefined}
                    >
                        {point.label && <Popup>{point.label}</Popup>}
                    </Marker>
                ))}

                {route && route.length > 0 && (
                    <Polyline positions={route} pathOptions={{color: routeColor, weight: 5}}/>
                )}
            </MapContainer>
        </div>
    )
}