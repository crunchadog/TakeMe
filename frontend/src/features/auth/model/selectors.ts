import {useAppSelector} from "@/shared/hooks/useAppSelector.ts";

export function useIsAuthenticated() {
    return useAppSelector(state => state.auth.token !== null)
}