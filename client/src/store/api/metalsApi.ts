import { baseApi } from './baseApi';

export interface IMetalRates {
  currency: 'INR';
  gold24k: number;
  gold22k: number;
  gold18k: number;
  silver: number;
  usdInr: number;
  source: 'live' | 'fallback';
  updatedAt: string;
}

interface MetalRatesResponse {
  success: boolean;
  data: IMetalRates;
}

export const metalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMetalRates: builder.query<MetalRatesResponse, void>({
      query: () => '/metals/rates',
    }),
  }),
  overrideExisting: false,
});

export const { useGetMetalRatesQuery } = metalsApi;
