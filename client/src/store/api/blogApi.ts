import { baseApi } from './baseApi';

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author: string;
  status: 'draft' | 'published';
  tags: string[];
  views: number;
  createdAt?: string;
}

export type BlogInput = Pick<IBlog, 'title' | 'excerpt' | 'content' | 'coverImage' | 'author' | 'status'>;

interface BlogsResponse {
  success: boolean;
  count: number;
  data: IBlog[];
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogsResponse, { status?: string } | void>({
      query: (arg) => (arg && arg.status ? `/blogs?status=${arg.status}` : '/blogs'),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Blog' as const, id: _id })),
              { type: 'Blog', id: 'LIST' },
            ]
          : [{ type: 'Blog', id: 'LIST' }],
    }),
    getBlogBySlug: builder.query<{ success: boolean; data: IBlog }, string>({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),
    createBlog: builder.mutation<{ success: boolean; data: IBlog }, Partial<BlogInput>>({
      query: (body) => ({ url: '/blogs', method: 'POST', body }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),
    updateBlog: builder.mutation<{ success: boolean; data: IBlog }, { id: string; body: Partial<IBlog> }>({
      query: ({ id, body }) => ({ url: `/blogs/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),
    deleteBlog: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/blogs/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
