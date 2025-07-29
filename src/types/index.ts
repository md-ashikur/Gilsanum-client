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
  description: string;
  highlightValue?: string;
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
  isHighlighted?: boolean;
}

export interface UserProfileType {
  name: string;
  email: string;
  avatar: string;
}
