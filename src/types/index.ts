export interface MenuItemType {
  id: string;
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
  badge?: number;
  children?: MenuItemType[];
  isExpandable?: boolean;
  isExpanded?: boolean;
}

export interface StatsCardType {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  pre_description: string;
  post_description: string;
  highlightValue?: string;
  icon?: string; 
}

export interface ProductItemType {
  id: string;
  rank: number;
  name: string;
  title?: string;
  price: number;
  orders: number;
  image: string;
  category: string;
  featured?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  rating?: number;
  reviews?: number;
  stock?: number;
  description?: string;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChartDataType {
  month?: string;
  value?: number;
  refund?: number;
  isHighlighted?: boolean;
  daily?: Array<{
    date: string;
    revenue: number;
    orders: number;
    label: string;
  }>;
  monthly?: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export interface UserProfileType {
  name: string;
  email: string;
  avatar: string;
}

export interface ShopItemType {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  rating?: number;
  reviews?: number;
}

export interface ShopFilterType {
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  featured: boolean;
}

// New types for the backend integration
export interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface OrderType {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
}

export interface DashboardStatsType {
  totalRevenue: {
    value: number;
    growth: number;
    formatted: string;
  };
  totalOrders: {
    value: number;
    growth: number;
    thisMonth: number;
  };
  totalCustomers: {
    value: number;
    growth: number;
    thisMonth: number;
  };
  totalProducts: {
    value: number;
    lowStock: number;
  };
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}
