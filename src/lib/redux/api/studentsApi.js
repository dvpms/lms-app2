import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => '/students',
      providesTags: ['Student'],
    }),
  }),
})

export const { useGetStudentsQuery } = studentsApi
