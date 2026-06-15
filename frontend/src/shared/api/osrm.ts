export interface RouteResult {
    coordinates: [number, number][]
    distanceKm: number
    durationMin: number
}

export async function fetchRoute(
    from: {lat: number, lng: number},
    to: {lat: number, lng: number},
    profile: 'driving' | 'foot' = 'driving',
) : Promise<RouteResult> {
    const url =
        `https://router.project-osrm.org/route/v1/${profile}/` +
        `${from.lng},${from.lat};${to.lng},${to.lat}` +
        `?overview=full&geometries=geojson`;

    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Не удалось построить маршрут')
    }

    const data = await res.json()
    const route = data.routes[0]

    if (!route) {
        throw new Error('Маршрут не найден')
    }

    const coordinates: [number, number][] = route.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]],
    )

    return {
        coordinates,
        distanceKm: route.distance / 1000,
        durationMin: Math.round(route.duration / 60),
    };
}