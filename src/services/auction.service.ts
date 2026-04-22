import api from '@/lib/api-client';
import type {
  Auction,
  AuctionFilters,
  AuctionListResponse,
  CreateAuctionInput,
  UpdateAuctionInput,
} from '@/types';

export const auctionService = {
  getAuctions: async (filters?: AuctionFilters): Promise<AuctionListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.sellerId) params.set('sellerId', filters.sellerId);
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());

    const response = await api.get<AuctionListResponse>(`/auctions?${params}`);
    return response.data;
  },

  getAuction: async (id: string): Promise<Auction> => {
    const response = await api.get<Auction>(`/auctions/${id}`);
    return response.data;
  },

  createAuction: async (data: CreateAuctionInput): Promise<Auction> => {
    const response = await api.post<Auction>('/auctions', data);
    return response.data;
  },

  updateAuction: async (id: string, data: UpdateAuctionInput): Promise<Auction> => {
    const response = await api.patch<Auction>(`/auctions/${id}`, data);
    return response.data;
  },

  deleteAuction: async (id: string): Promise<void> => {
    await api.delete(`/auctions/${id}`);
  },

  getMyListings: async (): Promise<Auction[]> => {
    const response = await api.get<Auction[]>('/auctions/my/listings');
    return response.data;
  },
};
