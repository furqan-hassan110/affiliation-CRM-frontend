export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  assignedCustomers: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  assignedAgentId: string | null;
  assignedAgentName?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  agentId: string;
  platform: Platform;
  productName: string;
  productUrl: string;
  affiliateLink?: string;
  status: OrderStatus;
  createdAt: string;
}

export type Platform = 
  | 'Amazon'
  | 'Walmart'
  | 'AliExpress'
  | 'eBay'
  | 'Temu'
  | 'Etsy'
  | 'Target'
  | 'Wayfair'
  | "Lowe's"
  | 'Shein'
  | 'Alibaba'
  | 'Ikea'
  | 'H&M'
  | 'Zara'
  | 'Alo'
  | 'Uniqlo';

export type OrderStatus = 'pending' | 'confirmed' | 'completed';

export const PLATFORMS: Platform[] = [
  'Amazon',
  'Walmart',
  'AliExpress',
  'eBay',
  'Temu',
  'Etsy',
  'Target',
  'Wayfair',
  "Lowe's",
  'Shein',
  'Alibaba',
  'Ikea',
  'H&M',
  'Zara',
  'Alo',
  'Uniqlo',
];
