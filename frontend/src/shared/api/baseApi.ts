import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {RootState} from "@/app/store.ts";

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Trip', 'Office'],
    endpoints: () => ({}),
});