import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  ProductItemType, 
  CustomerType, 
  OrderType, 
  DashboardStatsType,
  ChartDataType
} from '../types';

// Define the base URL for the API
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Define API response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}


// Create the API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Product', 'Customer', 'Order', 'Dashboard'],
  endpoints: (builder) => ({
    // Products endpoints
    getProducts: builder.query<ApiResponse<ProductItemType[]>, {
      category?: string;
      featured?: boolean;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      sort?: string;
    }>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    
    getProduct: builder.query<ApiResponse<ProductItemType>, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    
    createProduct: builder.mutation<ApiResponse<ProductItemType>, Partial<ProductItemType>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    
    updateProduct: builder.mutation<ApiResponse<ProductItemType>, { id: string; product: Partial<ProductItemType> }>({
      query: ({ id, product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }],
    }),
    
    deleteProduct: builder.mutation<ApiResponse<ProductItemType>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    
    // Customers endpoints
    getCustomers: builder.query<ApiResponse<CustomerType[]>, {
      status?: string;
      search?: string;
      sort?: string;
    }>({
      query: (params) => ({
        url: '/customers',
        params,
      }),
      providesTags: ['Customer'],
    }),
    
    getCustomer: builder.query<ApiResponse<CustomerType>, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Customer', id }],
    }),
    
    createCustomer: builder.mutation<ApiResponse<CustomerType>, Partial<CustomerType>>({
      query: (customer) => ({
        url: '/customers',
        method: 'POST',
        body: customer,
      }),
      invalidatesTags: ['Customer'],
    }),
    
    updateCustomer: builder.mutation<ApiResponse<CustomerType>, { id: string; customer: Partial<CustomerType> }>({
      query: ({ id, customer }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: customer,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Customer', id }],
    }),
    
    deleteCustomer: builder.mutation<ApiResponse<CustomerType>, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),
    
    // Orders endpoints
    getOrders: builder.query<ApiResponse<OrderType[]>, {
      status?: string;
      customerId?: string;
      search?: string;
      sort?: string;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    
    getOrder: builder.query<ApiResponse<OrderType>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    
    createOrder: builder.mutation<ApiResponse<OrderType>, Partial<OrderType>>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order', 'Dashboard'],
    }),
    
    updateOrder: builder.mutation<ApiResponse<OrderType>, { id: string; order: Partial<OrderType> }>({
      query: ({ id, order }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: order,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Order', id }, 'Dashboard'],
    }),
    
    deleteOrder: builder.mutation<ApiResponse<OrderType>, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order', 'Dashboard'],
    }),
    
    // Dashboard endpoints
    getDashboardStats: builder.query<ApiResponse<DashboardStatsType>, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    
    getChartData: builder.query<ApiResponse<ChartDataType>, void>({
      query: () => '/dashboard/chart-data',
      providesTags: ['Dashboard'],
    }),
    
    getRecentOrders: builder.query<ApiResponse<OrderType[]>, { limit?: number }>({
      query: (params) => ({
        url: '/dashboard/recent-orders',
        params,
      }),
      providesTags: ['Dashboard'],
    }),
    
    getPopularProducts: builder.query<ApiResponse<ProductItemType[]>, { limit?: number }>({
      query: (params) => ({
        url: '/dashboard/popular-products',
        params,
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Products
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  
  // Customers
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  
  // Orders
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  
  // Dashboard
  useGetDashboardStatsQuery,
  useGetChartDataQuery,
  useGetRecentOrdersQuery,
  useGetPopularProductsQuery,
} = api;
