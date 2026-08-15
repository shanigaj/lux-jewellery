import { baseApi } from './baseApi';

export interface IAuditLog {
  _id: string;
  action: string;
  target?: string;
  userName: string;
  role?: string;
  ip?: string;
  createdAt: string;
}

interface AuditResponse {
  success: boolean;
  count: number;
  data: IAuditLog[];
}

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditResponse, void>({
      query: () => '/audit-logs',
      providesTags: [{ type: 'Audit', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAuditLogsQuery } = auditApi;
