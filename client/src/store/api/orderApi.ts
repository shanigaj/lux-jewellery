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

// Payload for creating an order (admin manual entry reuses the public
// POST /orders; the backend honours `status`/`paymentStatus`/`adminNote`
// only when the caller is an admin).
export interface CreateOrderItemInput {
  product?: string;
  name: string;
  thumbnail?: string;
  sku?: string;
  metalType?: string;
  metalPurity?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderBody {
  items: CreateOrderItemInput[];
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  paymentMethod: string;
  transactionId?: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  taxRate: number;
  couponDiscount: number;
  giftCardAmount: number;
  totalAmount: number;
  couponCode?: string;
  customerNote?: string;
  // Admin-only overrides
  status?: string;
  paymentStatus?: string;
  adminNote?: string;
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
    createOrder: builder.mutation<OrderResponse, CreateOrderBody>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    updateOrder: builder.mutation<OrderResponse, { id: string } & CreateOrderBody>({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
    deleteOrder: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
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
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApi;
