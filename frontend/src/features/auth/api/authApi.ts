import {baseApi} from "@/shared/api/baseApi.ts";

interface AuthResponse {
    access_token: string;
}

interface LoginArgs {
    email: string;
    password: string;
}

interface RegisterArgs {
    email: string;
    name: string;
    password: string;
    organizationToken: string;
    city?: string | null;
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginArgs>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body
            })
        }),
        register: builder.mutation<AuthResponse, RegisterArgs>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body
            })
        })
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
} = authApi