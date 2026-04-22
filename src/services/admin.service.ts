import api from '@/lib/api-client';
import type { Auction, AuctionFilters, AuctionListResponse, RejectAuctionInput } from '@/types';

export const adminService = {
  getPendingAuctions: async (): Promise<Auction[]> => {
    const response = await api.get<Auction[]>('/admin/auctions/pending');
    return response.data;
  },

  getAllAuctions: async (filters?: AuctionFilters): Promise<AuctionListResponse> => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status as string);
    if (filters?.sellerId) params.set('sellerId', filters.sellerId);
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());

    const response = await api.get<AuctionListResponse>(`/admin/auctions?${params}`);
    return response.data;
  },

  approveAuction: async (id: string): Promise<Auction> => {
    const response = await api.patch<Auction>(`/admin/auctions/${id}/approve`);
    return response.data;
  },

  rejectAuction: async (id: string, data?: RejectAuctionInput): Promise<Auction> => {
    const response = await api.patch<Auction>(`/admin/auctions/${id}/reject`, data);
    return response.data;
  },
};
