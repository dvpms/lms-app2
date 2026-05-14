import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const activityApi = createApi({
  reducerPath: 'activityApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    postActivity: builder.mutation({
      query: (body) => ({ url: '/activity', method: 'POST', body }),
    }),
  }),
})

export const { usePostActivityMutation } = activityApi
