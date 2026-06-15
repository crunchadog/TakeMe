import {useAppSelector} from "@/shared/hooks/useAppSelector.ts";

type CurrentUserRole = 'ADMIN' | 'EMPLOYEE'

interface CurrentUser {
    id: string;
    email: string;
    role: CurrentUserRole,
    organizationId: string
}

function decodeJwt(token: string): CurrentUser | null {
    try {
        const payload = token.split('.')[1]
        const json = atob(payload)
        const data = JSON.parse(json)

        return {
            id: data.sub,
            email: data.email,
            role: data.role,
            organizationId: data.organizationId,
        }
    } catch (error) {
        return null
    }
}

export function useCurrentUser(): CurrentUser | null {
    const token = useAppSelector(state => state.auth.token)
    return token ? decodeJwt(token) : null
}