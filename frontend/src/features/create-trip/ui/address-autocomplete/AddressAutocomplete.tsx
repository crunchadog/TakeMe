import {useEffect, useState, useRef} from "react";

import {type GeoSuggestion, searchAddress} from "@/shared/api/geocode.ts";
import {useDebounce} from "@/shared/lib/useDebounce.ts";
import {Input} from "@/shared/ui/Input/Input.tsx";

import styles from './AddressAutocomplete.module.css'

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSelect: (suggestion: GeoSuggestion) => void;
}

export function AddressAutocomplete({value, onChange, onSelect}: Props) {
    const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const debounced = useDebounce(value)

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false)
            }

            document.addEventListener("mousedown", handleClickOutside)

            return () => document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        let active = true
        if (debounced.trim().length < 3) {
            setSuggestions([])
            return;
        }

        if (debounced === value && !open) return;

        setLoading(true)
        searchAddress(debounced)
            .then((result) => {
                if (active) {
                    setSuggestions(result)
                    setOpen(true)
                }
            })
            .catch(() => active && setSuggestions([]))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [debounced])

    const handlePick = (sug: GeoSuggestion) => {
        onSelect(sug)
        onChange(sug.label)
        setOpen(false)
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <Input
                label='Адрес старта'
                value={value}
                onChange={e => {
                    onChange(e.target.value)
                    setOpen(true)
                }}
                onFocus={() => value.length >= 3 && setOpen(true)}
                autoComplete={"off"}
                required
            />
            {loading && <span className={styles.loading}>Поиск...</span>}
            {open && suggestions.length > 0 && (
                <ul className={styles.list}>
                    {suggestions.map((suggestion, index) => (
                        <li key={index}
                            className={styles.item}
                            onClick={() => handlePick(suggestion)}
                        >
                            {suggestion.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}