import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const quizzesApi = createApi({
  reducerPath: 'quizzesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Quiz'],
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: (params) => ({ url: '/quizzes', params }),
      providesTags: ['Quiz'],
    }),
    getQuiz: builder.query({
      query: (id) => `/quizzes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Quiz', id }],
    }),
    createQuiz: builder.mutation({
      query: (body) => ({ url: '/quizzes', method: 'POST', body }),
      invalidatesTags: ['Quiz'],
    }),
    updateQuiz: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/quizzes/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Quiz'],
    }),
    deleteQuiz: builder.mutation({
      query: (id) => ({ url: `/quizzes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Quiz'],
    }),
    submitQuiz: builder.mutation({
      query: ({ id, answers, questionIds }) => ({
        url: `/quizzes/${id}/submit`,
        method: 'POST',
        body: { answers, questionIds },
      }),
    }),
  }),
})

export const {
  useGetQuizzesQuery,
  useGetQuizQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useSubmitQuizMutation,
} = quizzesApi
