import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Load } from '@/types';



export const loadApi = createApi({
  reducerPath: 'loadApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.71:3001/api' }),
  tagTypes: ['Load'],
  endpoints: (builder) => ({
    getLoads: builder.query<{ success: boolean; data: Load[] }, void>({
      query: () => '/loads',
      providesTags: ['Load'],
    }),
    getAcceptedLoads: builder.query<{ success: boolean; data: Load[] }, string>({
      query: (driverId) => `/loads/driver/${driverId}`,
      providesTags: ['Load'],
    }),
    acceptLoad: builder.mutation<{ success: boolean; data: Load }, { loadId: string; driverId: string }>({
      query: ({ loadId, driverId }) => ({
        url: `/loads/${loadId}/accept`,
        method: 'PATCH',
        body: { driverId },
      }),
      invalidatesTags: ['Load'],
 
      async onQueryStarted({ loadId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          loadApi.util.updateQueryData('getLoads', undefined, (draft) => {
            if (draft && draft.data) {
              // Use `id` — backend's toJSON transform maps _id → id
              draft.data = draft.data.filter((load) => load.id !== loadId);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Revert cache if API call failed
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetLoadsQuery, useGetAcceptedLoadsQuery, useAcceptLoadMutation } = loadApi;
