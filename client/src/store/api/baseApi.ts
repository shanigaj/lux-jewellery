import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    credentials: 'include', // Crucial for HttpOnly cookies
  }),
  tagTypes: ['Product', 'Order', 'User', 'Cart', 'Review', 'Coupon', 'Blog', 'Audit'],
  endpoints: () => ({}), // Endpoints will be injected here
});
