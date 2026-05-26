import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setUser } from '@/lib/redux/slices/authSlice'

export const activityApi = createApi({
  reducerPath: 'activityApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    postActivity: builder.mutation({
      query: (body) => ({ url: '/activity', method: 'POST', body }),
      async onQueryStarted(_body, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const result = data?.data
          if (!result) return

          const currentUser = getState()?.auth?.user
          if (!currentUser) return

          dispatch(setUser({
            ...currentUser,
            points: result.points ?? currentUser.points,
            level: result.level ?? currentUser.level,
          }))
        } catch {
          // Swallow errors here; the caller can still handle mutation error state if needed.
        }
      },
    }),
  }),
})

export const { usePostActivityMutation } = activityApi
