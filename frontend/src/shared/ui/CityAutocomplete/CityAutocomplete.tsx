import {useEffect, useState} from "react";


import {Input} from "@/shared/ui/Input/Input.tsx";
import {useDebounce} from "@/shared/lib/useDebounce.ts";
import {type CitySuggestion, searchCity} from "@/shared/api/geocode.ts";

import styles from './CityAutocomplete.module.css'

interface CityAutocompleteProps {
    value: string
    onChange: (city: string) => void
    label?: string
}

export function CityAutocomplete({value, onChange, label = 'Город'}: CityAutocompleteProps) {
    const [suggestion, setSuggestion] = useState<CitySuggestion[]>([])
    const [open, setOpen] = useState(false)
    const [picked, setPicked] = useState(false)
    const debounced = useDebounce(value, 500)

    useEffect(() => {
        let active = true
        if (picked || debounced.trim().length < 2) {
            setSuggestion([])
            return
        }

        searchCity(debounced)
            .then(res => active && (setSuggestion(res), setOpen(true)))
            .catch(() => active && setSuggestion([]))

        return () => {
            active = false
        }
    }, [debounced, picked]);

    const handlePick = (sug: CitySuggestion) => {
        onChange(sug.city)
        setPicked(true)
        setOpen(false)
    }

    return (
        <div className={styles.wrapper}>
            <Input
                label={label}
                value={value}
                onChange={(e) => {
                    setPicked(false)
                    onChange(e.target.value)
                }}
                onFocus={() => suggestion.length && setOpen(true)}
                autoComplete='off'
                required
            />

            {open && suggestion.length > 0 && (
                <ul className={styles.list}>
                    {suggestion.map((item, i) => (
                        <li
                            key={i}
                            className={styles.item}
                            onClick={() => handlePick(item)}
                        >
                            {item.city}
                            {item.region && item.region !== item.city && (
                                <span className={styles.region}>{item.region}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}