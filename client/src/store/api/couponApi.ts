import { baseApi } from './baseApi';

export interface ICoupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  expiresAt: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  createdAt?: string;
}

export type CouponInput = Omit<ICoupon, '_id' | 'usedCount' | 'createdAt'>;

interface CouponsResponse {
  success: boolean;
  count: number;
  data: ICoupon[];
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<CouponsResponse, void>({
      query: () => '/coupons',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Coupon' as const, id: _id })),
              { type: 'Coupon', id: 'LIST' },
            ]
          : [{ type: 'Coupon', id: 'LIST' }],
    }),
    createCoupon: builder.mutation<{ success: boolean; data: ICoupon }, Partial<CouponInput>>({
      query: (body) => ({ url: '/coupons', method: 'POST', body }),
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),
    updateCoupon: builder.mutation<{ success: boolean; data: ICoupon }, { id: string; body: Partial<ICoupon> }>({
      query: ({ id, body }) => ({ url: `/coupons/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Coupon', id },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),
    deleteCoupon: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/coupons/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
