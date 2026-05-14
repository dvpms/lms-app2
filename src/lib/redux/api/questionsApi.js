import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const questionsApi = createApi({
  reducerPath: 'questionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Question'],
  endpoints: (builder) => ({
    createQuestion: builder.mutation({
      query: (body) => ({ url: '/questions', method: 'POST', body }),
      invalidatesTags: ['Question'],
    }),
    updateQuestion: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/questions/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Question'],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({ url: `/questions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Question'],
    }),
  }),
})

export const {
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionsApi
