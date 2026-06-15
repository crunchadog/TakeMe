import {baseApi} from "@/shared/api/baseApi.ts";

export interface Office {
    id: string;
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
        })
    })
})

export const {
    useGetOfficesQuery,
} = officeApi