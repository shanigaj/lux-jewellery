import { baseApi } from './baseApi';
import type { IOrder } from '@/types/order.types';

// Use the canonical order shape from types/order.types.ts rather than a
// divergent local duplicate, so pages get the full typed order model.
export type { IOrder };

interface OrdersResponse {
  success: boolean;
  orders: IOrder[];
}

interface OrderResponse {
  success: boolean;
  order: IOrder;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserOrders: builder.query<OrdersResponse, void>({
      query: () => '/orders/myorders',
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({ type: 'Order' as const, id: _id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getAllOrders: builder.query<OrdersResponse, void>({
      query: () => '/orders',
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({ type: 'Order' as const, id: _id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation<
      OrderResponse,
      { id: string; status: string; trackingNumber?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
