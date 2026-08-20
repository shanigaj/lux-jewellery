import { baseApi } from './baseApi';

export interface IAdminUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'user' | 'admin' | 'manager' | 'support';
  tier?: string;
  isVerified?: boolean;
  createdAt?: string;
}

interface UsersResponse {
  success: boolean;
  count: number;
  data: IAdminUser[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, void>({
      query: () => '/auth/users',
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUserRole: builder.mutation<
      { success: boolean; data: IAdminUser },
      { id: string; role: IAdminUser['role'] }
    >({
      query: ({ id, role }) => ({
        url: `/auth/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useUpdateUserRoleMutation } = userApi;
