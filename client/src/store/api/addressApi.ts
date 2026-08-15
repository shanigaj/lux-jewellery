import { baseApi } from './baseApi';

export interface IAddress {
  _id: string;
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type AddressInput = Omit<IAddress, '_id'>;

interface AddressesResponse {
  success: boolean;
  data: IAddress[];
}

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressesResponse, void>({
      query: () => '/auth/addresses',
      providesTags: [{ type: 'Address', id: 'LIST' }],
    }),
    addAddress: builder.mutation<AddressesResponse, Partial<AddressInput>>({
      query: (body) => ({ url: '/auth/addresses', method: 'POST', body }),
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),
    updateAddress: builder.mutation<AddressesResponse, { id: string; body: Partial<AddressInput> }>({
      query: ({ id, body }) => ({ url: `/auth/addresses/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),
    deleteAddress: builder.mutation<AddressesResponse, string>({
      query: (id) => ({ url: `/auth/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
