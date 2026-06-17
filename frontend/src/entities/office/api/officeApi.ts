import {baseApi} from "@/shared/api/baseApi.ts";

export interface Office {
    id: string;
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
}

interface CreatedOfficeArgs {
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
}

export const officeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOffices: builder.query<Office[], void>({
            query: () => '/offices',
            providesTags: ['Office'],
        }),
        createOffice: builder.mutation<Office, CreatedOfficeArgs>({
            query: (body) => ({
                url: '/offices',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Office'],
        }),
        deleteOffice: builder.mutation<{success: boolean}, string>({
            query: (id) => ({
                url: `/offices/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Office'],
        })
    })
})

export const {
    useGetOfficesQuery,
    useCreateOfficeMutation,
    useDeleteOfficeMutation,
} = officeApi