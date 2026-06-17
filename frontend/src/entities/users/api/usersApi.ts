import {baseApi} from "@/shared/api/baseApi.ts";

export interface Me {
    id: string,
    email: string,
    name: string,
    role: 'ADMIN' | 'EMPLOYEE',
    city: string | null,
    organization?: { name: string, inviteToken: string },
    homeAddress: string | null,
    homeLat: number | null,
    homeLng: number | null,
}

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            getMe: builder.query<Me, void>({
                query: () => '/users/me',
                providesTags: ['Me'],
            })
        }
    }
})

export const {
    useGetMeQuery
} = usersApi