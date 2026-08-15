import { baseApi } from './baseApi';

export interface IAdminReview {
  _id: string;
  rating: number;
  comment: string;
  isApproved?: boolean;
  createdAt: string;
  user?: { _id: string; firstName?: string; email?: string };
  product?: { _id: string; name?: string; sku?: string };
}

interface ReviewsResponse {
  status: string;
  count: number;
  data: IAdminReview[];
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<ReviewsResponse, void>({
      query: () => '/reviews',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Review' as const, id: _id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),
    updateReviewStatus: builder.mutation<unknown, { id: string; isApproved: boolean }>({
      query: ({ id, isApproved }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body: { isApproved },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Review', id },
        { type: 'Review', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllReviewsQuery, useUpdateReviewStatusMutation } = reviewApi;
