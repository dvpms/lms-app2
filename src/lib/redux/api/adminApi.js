import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['AdminStats'],
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['AdminStats'],
    }),
  }),
})

export const { useGetAdminStatsQuery } = adminApi
