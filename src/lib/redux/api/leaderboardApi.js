import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Leaderboard'],
  endpoints: (builder) => ({
    getLeaderboard: builder.query({
      query: () => '/leaderboard',
      providesTags: ['Leaderboard'],
    }),
  }),
})

export const { useGetLeaderboardQuery } = leaderboardApi
