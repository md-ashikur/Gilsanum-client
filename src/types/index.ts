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
  orders: number;
  image: string;
}

export interface ChartDataType {
  month: string;
  value: number;
  refund: number;
  isHighlighted?: boolean;
}

export interface UserProfileType {
  name: string;
  email: string;
  avatar: string;
}
