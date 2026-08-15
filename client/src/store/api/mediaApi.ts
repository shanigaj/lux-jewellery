import { baseApi } from './baseApi';

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ status: string; data: { url: string; filename: string } }, FormData>({
      query: (formData) => ({
        url: '/media/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadMultipleImages: builder.mutation<{ status: string; data: { url: string; filename: string }[] }, FormData>({
      query: (formData) => ({
        url: '/media/upload-multiple',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useUploadImageMutation, useUploadMultipleImagesMutation } = mediaApi;
