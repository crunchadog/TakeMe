import {baseApi} from "@/shared/api/baseApi.ts";

interface CreateOrgArgs {
    organizationName: string;
    inviteToken?: string;
    name: string;
    email: string;
    password: string;
    city: string;
}

interface CreateOrgResponse {
    access_token: string;
    inviteToken: string;
}

export const organizationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCitiesByToken: builder.query<string[], string> ({
            query: (token)=> `/organizations/cities?token=${encodeURIComponent(token)}`,
        }),
        createOrganization: builder.mutation<CreateOrgResponse, CreateOrgArgs>({
            query: (body) => ({
                url: '/organizations',
                method: 'POST',
                body: body,
            })
        })
    })
})

export const {
    useLazyGetCitiesByTokenQuery,
    useCreateOrganizationMutation,
} = organizationApi