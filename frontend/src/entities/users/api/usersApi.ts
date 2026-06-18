import {baseApi} from "@/shared/api/baseApi.ts";

export interface Me {
    id: string,
    email: string,
    name: string,
    avatarColor?: string | null,
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
            }),
            updateMe: builder.mutation<Me, Partial<{
                name: string, city: string;
                homeAddress: string, homeLat: number, homeLng: number
                avatarColor: string
            }>>({
                query: (body) => ({
                    url: 'users/me',
                    method: 'PATCH',
                    body: body
                }),
                invalidatesTags: ['Me'],
            }),
            deleteMe: builder.mutation<{ success: boolean }, void>({
                query: () => ({url: '/users/me', method: 'DELETE'}),
            }),
        }
    }
})

export const {
    useGetMeQuery,
    useUpdateMeMutation,
    useDeleteMeMutation,
} = usersApi