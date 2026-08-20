import { baseApi } from './baseApi';
import { IProduct } from '@/types/product.types';
import { optimizeCloudinaryImage, optimizeCloudinaryVideo, productThumb } from '@/lib/cloudinary';

interface GetProductsParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  status: string;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: IProduct[];
}

interface ProductResponse {
  status: string;
  data: IProduct;
}

// Shape the backend expects when creating/updating a product (raw write model),
// distinct from the adapted IProduct read shape returned by adaptProduct().
export interface CreateProductInput {
  name: string;
  sku: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  metalType: string;
  gemstone?: string;
  images: string[];
  stock: number;
  isFeatured?: boolean;
}

// The catalogue no longer ships local stock photos. Any image that isn't a
// genuine remote (http/https, i.e. Cloudinary) URL — e.g. a legacy seed path
// like "/images/products/necklace.png" that no longer exists on disk — is
// dropped so the piece falls back to the neutral placeholder instead of a
// broken image.
const PLACEHOLDER = '/images/placeholder.png';
const isRemote = (url: unknown): url is string =>
  typeof url === 'string' && /^https?:\/\//i.test(url);

const adaptProduct = (product: any): IProduct => {
  const remoteImages: string[] = Array.isArray(product.images)
    ? product.images.filter(isRemote)
    : [];

  return {
  ...product,
  slug: product._id, // Temporary fallback if no slug exists
  basePrice: product.price || 0,
  salePrice: product.discountPrice || undefined,
  currency: 'INR',
  shortDescription: product.description?.substring(0, 120) + '...' || '',
  category: {
    _id: product.category || 'misc',
    name: product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Misc',
    slug: product.category || 'misc',
    description: '',
    image: '',
    sortOrder: 0,
    isActive: true,
    seo: {}
  },
  collections: [],
  metalType: product.metalType || 'gold',
  metalPurity: '18K',
  weight: 5,
  images: remoteImages.length > 0
    ? remoteImages.map((url: string, i: number) => ({
        _id: `img_${i}`,
        url: optimizeCloudinaryImage(url),
        publicId: '',
        altText: product.name || 'Product Image',
        sortOrder: i,
        isDefault: i === 0
      }))
    : [{ _id: 'default', url: PLACEHOLDER, publicId: '', altText: 'Placeholder', sortOrder: 0, isDefault: true }],
  thumbnail: remoteImages.length > 0 ? productThumb(remoteImages[0]) : PLACEHOLDER,
  videos: Array.isArray(product.videos) ? product.videos.map((v: string) => optimizeCloudinaryVideo(v)) : [],
  video: Array.isArray(product.videos) && product.videos.length > 0 ? optimizeCloudinaryVideo(product.videos[0]) : product.video,
  variants: [],
  stockQuantity: product.stock || 0,
  lowStockThreshold: 5,
  trackInventory: true,
  isActive: true,
  isBestseller: product.isFeatured || false,
  isNewArrival: false,
  avgRating: product.ratingsAverage || 0,
  reviewCount: product.ratingsQuantity || 0,
  seo: {},
  tags: [],
  };
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams | void>({
      query: (params) => {
        let url = '/products';
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.category && params.category !== 'all') queryParams.append('category', params.category);
          if (params.search) queryParams.append('search', params.search);
          if (params.minPrice) queryParams.append('price[gte]', params.minPrice.toString());
          if (params.maxPrice) queryParams.append('price[lte]', params.maxPrice.toString());
          if (params.sort) queryParams.append('sort', params.sort);
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
          
          const queryString = queryParams.toString();
          if (queryString) url += `?${queryString}`;
        }
        return url;
      },
      transformResponse: (response: any) => ({
        status: response.status,
        count: response.count,
        total: response.total,
        page: response.page,
        pages: response.pages,
        data: response.data.map(adaptProduct),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Product' as const, id: _id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProductById: builder.query<ProductResponse, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: any) => ({
        status: response.status,
        data: adaptProduct(response.data),
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<ProductResponse, CreateProductInput>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<ProductResponse, { id: string; body: Partial<CreateProductInput> }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation<{ status: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
  // In dev, Fast Refresh re-evaluates this module and re-injects the endpoints;
  // allow the override so it doesn't throw a console error on every edit.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
