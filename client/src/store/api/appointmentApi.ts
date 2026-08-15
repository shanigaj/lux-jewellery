import { baseApi } from './baseApi';

export interface IAppointment {
  _id: string;
  experience: string;
  boutiqueId?: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  interest?: string;
  notes?: string;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
}

export type AppointmentInput = Omit<IAppointment, '_id' | 'status' | 'createdAt'>;

interface ListResponse {
  success: boolean;
  count: number;
  data: IAppointment[];
}

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAppointment: builder.mutation<{ success: boolean; data: IAppointment }, Partial<AppointmentInput>>({
      query: (body) => ({ url: '/appointments', method: 'POST', body }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    getMyAppointments: builder.query<ListResponse, void>({
      query: () => '/appointments/mine',
      providesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    getAllAppointments: builder.query<ListResponse, void>({
      query: () => '/appointments',
      providesTags: [{ type: 'Appointment', id: 'ADMIN' }],
    }),
    updateAppointmentStatus: builder.mutation<{ success: boolean; data: IAppointment }, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/appointments/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: [{ type: 'Appointment', id: 'ADMIN' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateAppointmentMutation,
  useGetMyAppointmentsQuery,
  useGetAllAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} = appointmentApi;
