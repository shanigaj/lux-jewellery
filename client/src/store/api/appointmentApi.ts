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
  }),
  overrideExisting: false,
});

export const { useCreateAppointmentMutation, useGetMyAppointmentsQuery } = appointmentApi;
