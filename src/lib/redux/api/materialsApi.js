import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const materialsApi = createApi({
  reducerPath: 'materialsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Material'],
  endpoints: (builder) => ({
    getMaterials: builder.query({
      query: (params) => ({
        url: '/materials',
        params,
      }),
      providesTags: ['Material'],
    }),
    getMaterial: builder.query({
      query: (id) => `/materials/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Material', id }],
    }),
    createMaterial: builder.mutation({
      query: (body) => ({ url: '/materials', method: 'POST', body }),
      invalidatesTags: ['Material'],
    }),
    updateMaterial: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/materials/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Material'],
    }),
    deleteMaterial: builder.mutation({
      query: (id) => ({ url: `/materials/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Material'],
    }),
  }),
})

export const {
  useGetMaterialsQuery,
  useGetMaterialQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialsApi
