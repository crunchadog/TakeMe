import type {CreateTripArgs, Trip} from "@/entities/trip/model/types.ts";
import {baseApi} from "@/shared/api/baseApi.ts";

export const tripApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTrips: builder.query<Trip[], void>({
            query: () => '/trips',
            providesTags: ['Trip'],
        }),
        getTrip: builder.query<Trip, string>({
            query: (id) => `/trips/${id}`,
            providesTags: ['Trip']
        }),
        createTrip: builder.mutation<Trip, CreateTripArgs>({
            query: (body) => ({
                url: '/trips/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Trip']
        }),
        joinTrip: builder.mutation<Trip, string>({
            query: (id) => ({
                url: `/trips/${id}/join`,
                method: 'POST'
            }),
            invalidatesTags: ['Trip'],
        }),
        leaveTrip: builder.mutation<Trip, string>({
            query: (id) => ({
                url: `/trips/${id}/leave`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Trip'],
        }),
        cancelTrip: builder.mutation<Trip, string>({
            query: (id) => ({
                url: `/trips/${id}/cancel`,
                method: "PATCH"
            }),
            invalidatesTags: ['Trip']
        })
    })
})

export const {
    useGetTripsQuery,
    useGetTripQuery,
    useCreateTripMutation,
    useJoinTripMutation,
    useLeaveTripMutation,
    useCancelTripMutation,
} = tripApi