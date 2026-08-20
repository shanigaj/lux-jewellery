import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logout } from '@/store/slices/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  credentials: 'include', // Crucial for HttpOnly cookies
});

// The access-token (`jwt`) cookie lives ~15 min; the refresh cookie (`jwtRefresh`)
// ~7 days. Once the access token expires, protected calls 401. Mirror the axios
// interceptor here so RTK Query calls (admin uploads, products, orders…) don't
// die after 15 minutes: on a 401, hit /auth/refresh once, then retry.
// A shared promise coalesces concurrent 401s into a single refresh.
let refreshInFlight: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === 'string' ? args : args.url;
  const isAuthCall =
    url.includes('/auth/refresh') ||
    url.includes('/auth/login') ||
    url.includes('/auth/logout');

  if (result.error?.status === 401 && !isAuthCall) {
    if (!refreshInFlight) {
      refreshInFlight = Promise.resolve(
        rawBaseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions)
      )
        .then((r) => !r.error)
        .finally(() => {
          refreshInFlight = null;
        });
    }

    const refreshed = await refreshInFlight;
    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions); // retry once
    } else {
      // Refresh failed — session is truly gone; clear local auth state.
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Order', 'User', 'Cart', 'Review', 'Coupon', 'Blog', 'Audit', 'Settings', 'Address', 'Appointment'],
  endpoints: () => ({}), // Endpoints will be injected here
});
