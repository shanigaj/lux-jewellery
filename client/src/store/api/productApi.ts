import { baseApi } from './baseApi';
import { IProduct } from '@/types/product.types';

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

const adaptProduct = (product: any): IProduct => ({
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
  images: Array.isArray(product.images) && product.images.length > 0 
    ? product.images.map((url: string, i: number) => ({
        _id: `img_${i}`,
        url,
        publicId: '',
        altText: product.name || 'Product Image',
        sortOrder: i,
        isDefault: i === 0
      }))
    : [{ _id: 'default', url: '/images/placeholder.jpg', publicId: '', altText: 'Placeholder', sortOrder: 0, isDefault: true }],
  thumbnail: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg',
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
});

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
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductByIdQuery, useCreateProductMutation } = productApi;
