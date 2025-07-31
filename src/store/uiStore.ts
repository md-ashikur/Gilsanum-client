import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// UI State Interface
interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  // Theme state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Loading states
  loading: {
    global: boolean;
    products: boolean;
    customers: boolean;
    orders: boolean;
    dashboard: boolean;
  };
  setLoading: (key: keyof UIState['loading'], value: boolean) => void;
  
  // Modal states
  modals: {
    productForm: boolean;
    customerForm: boolean;
    orderForm: boolean;
    deleteConfirm: boolean;
  };
  setModal: (key: keyof UIState['modals'], value: boolean) => void;
  
  // Selected items for actions
  selectedProductId: string | null;
  selectedCustomerId: string | null;
  selectedOrderId: string | null;
  setSelectedProductId: (id: string | null) => void;
  setSelectedCustomerId: (id: string | null) => void;
  setSelectedOrderId: (id: string | null) => void;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Search and filters
  searchQueries: {
    products: string;
    customers: string;
    orders: string;
  };
  setSearchQuery: (key: keyof UIState['searchQueries'], value: string) => void;
  
  filters: {
    products: {
      category: string;
      priceRange: { min: number; max: number };
      featured: boolean;
      sort: string;
    };
    customers: {
      status: string;
      sort: string;
    };
    orders: {
      status: string;
      sort: string;
    };
  };
  setProductFilters: (filters: Partial<UIState['filters']['products']>) => void;
  setCustomerFilters: (filters: Partial<UIState['filters']['customers']>) => void;
  setOrderFilters: (filters: Partial<UIState['filters']['orders']>) => void;
  
  // Reset functions
  resetFilters: () => void;
  resetUI: () => void;
}

// Create the store
export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Sidebar state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Theme state
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      // Loading states
      loading: {
        global: false,
        products: false,
        customers: false,
        orders: false,
        dashboard: false,
      },
      setLoading: (key, value) =>
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        })),
      
      // Modal states
      modals: {
        productForm: false,
        customerForm: false,
        orderForm: false,
        deleteConfirm: false,
      },
      setModal: (key, value) =>
        set((state) => ({
          modals: { ...state.modals, [key]: value },
        })),
      
      // Selected items
      selectedProductId: null,
      selectedCustomerId: null,
      selectedOrderId: null,
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),
      setSelectedOrderId: (id) => set({ selectedOrderId: id }),
      
      // Notifications
      notifications: [],
      addNotification: (type, message) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const notification = {
          id,
          type,
          message,
          timestamp: Date.now(),
        };
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
      
      // Search queries
      searchQueries: {
        products: '',
        customers: '',
        orders: '',
      },
      setSearchQuery: (key, value) =>
        set((state) => ({
          searchQueries: { ...state.searchQueries, [key]: value },
        })),
      
      // Filters
      filters: {
        products: {
          category: 'All',
          priceRange: { min: 0, max: 2000 },
          featured: false,
          sort: 'default',
        },
        customers: {
          status: 'all',
          sort: 'name_asc',
        },
        orders: {
          status: 'all',
          sort: 'date_desc',
        },
      },
      setProductFilters: (filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            products: { ...state.filters.products, ...filters },
          },
        })),
      setCustomerFilters: (filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            customers: { ...state.filters.customers, ...filters },
          },
        })),
      setOrderFilters: (filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            orders: { ...state.filters.orders, ...filters },
          },
        })),
      
      // Reset functions
      resetFilters: () =>
        set({
          filters: {
            products: {
              category: 'All',
              priceRange: { min: 0, max: 2000 },
              featured: false,
              sort: 'default',
            },
            customers: {
              status: 'all',
              sort: 'name_asc',
            },
            orders: {
              status: 'all',
              sort: 'date_desc',
            },
          },
          searchQueries: {
            products: '',
            customers: '',
            orders: '',
          },
        }),
      resetUI: () =>
        set({
          sidebarCollapsed: false,
          modals: {
            productForm: false,
            customerForm: false,
            orderForm: false,
            deleteConfirm: false,
          },
          selectedProductId: null,
          selectedCustomerId: null,
          selectedOrderId: null,
          notifications: [],
        }),
    }),
    {
      name: 'gilsanum-ui-store',
    }
  )
);
