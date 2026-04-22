import { z } from 'zod';

// ==================== USER ====================
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

// ==================== AUCTION ====================
export type AuctionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';

export interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  currentPrice: string;
  imageUrl: string | null;
  endTime: string;
  status: AuctionStatus;
  sellerId: string;
  seller: User;
  bids: Bid[];
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuctionInput {
  title: string;
  description: string;
  startingPrice: number;
  endTime: string;
  imageUrl?: string;
}

export interface UpdateAuctionInput extends Partial<CreateAuctionInput> {}

export interface AuctionFilters {
  search?: string;
  sellerId?: string;
  status?: AuctionStatus;
  page?: number;
  limit?: number;
}

export interface AuctionListResponse {
  data: Auction[];
  total: number;
}

// ==================== BID ====================
export interface Bid {
  id: string;
  amount: string;
  bidderId: string;
  auctionId: string;
  createdAt: string;
}

export interface CreateBidInput {
  amount: number;
}

// ==================== AUTH ====================
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// ==================== ADMIN ====================
export interface RejectAuctionInput {
  rejectionReason?: string;
}

// ==================== VALIDATION SCHEMAS ====================
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createAuctionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startingPrice: z.number().positive('Starting price must be positive'),
  endTime: z.string().refine((val) => {
    const date = new Date(val);
    return date > new Date();
  }, 'End time must be in the future'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const bidSchema = z.object({
  amount: z.number().positive('Bid amount must be positive'),
});
