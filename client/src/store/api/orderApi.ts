import { baseApi } from './baseApi';

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: string;
  items: any[];
  shippingAddress: any;
  payment: any;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  timeline: any[];
  createdAt: string;
  updatedAt: string;
}

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
  }),
  overrideExisting: false,
});

export const { useGetUserOrdersQuery, useGetAllOrdersQuery, useGetOrderByIdQuery } = orderApi;
