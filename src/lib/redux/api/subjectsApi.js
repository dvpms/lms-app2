import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const subjectsApi = createApi({
  reducerPath: 'subjectsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Subject'],
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: () => '/subjects',
      providesTags: ['Subject'],
    }),
    getSubject: builder.query({
      query: (id) => `/subjects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Subject', id }],
    }),
    createSubject: builder.mutation({
      query: (body) => ({ url: '/subjects', method: 'POST', body }),
      invalidatesTags: ['Subject'],
    }),
    updateSubject: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/subjects/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Subject'],
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({ url: `/subjects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Subject'],
    }),
  }),
})

export const {
  useGetSubjectsQuery,
  useGetSubjectQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectsApi
