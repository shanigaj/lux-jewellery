import { baseApi } from './baseApi';

export interface IBoutique {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface ISiteSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  currency: string;
  timezone: string;
  freeShippingThreshold: number;
  announcements: string[];
  boutiques: IBoutique[];
  timeSlots: string[];
}

interface SettingsResponse {
  success: boolean;
  data: ISiteSettings;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsResponse, void>({
      query: () => '/settings',
      providesTags: [{ type: 'Settings', id: 'SITE' }],
    }),
    updateSettings: builder.mutation<SettingsResponse, Partial<ISiteSettings>>({
      query: (body) => ({ url: '/settings', method: 'PUT', body }),
      invalidatesTags: [{ type: 'Settings', id: 'SITE' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
