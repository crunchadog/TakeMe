import {useEffect, useState} from "react";

export function useDebounce<T>(value: T, delay = 500): T{
    const [debounceValue, setDebounce] = useState<T>(value)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounce(value)
        }, delay)

        return () => clearTimeout(timeout)
    }, [value, debounceValue])

    return debounceValue
}