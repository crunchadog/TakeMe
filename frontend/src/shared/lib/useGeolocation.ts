import {useState} from "react";

export function useGeolocation() {
    const [loading, setLoading] = useState(false);

    const getLocation = (): Promise<{ lat: number, lng: number }> => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                setLoading(false)
                reject(new Error("Геолокация не поддерживается"));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLoading(false)
                    resolve({lat: position.coords.latitude, lng: position.coords.longitude});
                },
                (error) => {
                    setLoading(false)
                    reject(new Error(`Не удалость определить местоположение ${error.message}`));
                })
        })
    }

    return {getLocation, loading};
}