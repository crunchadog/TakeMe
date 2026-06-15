export interface GeoSuggestion {
    label: string;
    lat: number;
    lng: number;
}

export async function searchAddress(query: string): Promise<GeoSuggestion[]> {
    if (query.trim().length < 3) {
        return []
    }

    const url =
        'https://nominatim.openstreetmap.org/search' +
        `?q=${encodeURIComponent(query)}` +
        '&format=json&addressdetails=1&limit=5&accept-language=ru'

    const res = await fetch(url, {
        headers: {
            'Accept-Language': 'ru',
        }
    })

    if (!res.ok) throw new Error('Ошибка геокодинга')

    const data = await res.json()
    console.log(data)
    return data.map((item: any) => {
        const parts = item.display_name.split(',');

        const cleanLabel = parts
            .slice(0, -3)
            .map((s: string) => s.trim())
            .join(', ');

        return {
            label: cleanLabel,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
        };
    })
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const url =
        'https://nominatim.openstreetmap.org/reverse' +
        `?lat=${lat}&lon=${lng}&format=json&accept-language=ru`;

    const res = await fetch(url, {
        headers:
            {'Accept-Language': 'ru'}
    });
    if (!res.ok) throw new Error('Ошибка геокодинга')

    const data = await res.json()
    console.log(data)
    return data.display_name ?? ''
}