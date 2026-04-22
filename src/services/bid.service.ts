import api from '@/lib/api-client';
import type { Bid, CreateBidInput } from '@/types';

export const bidService = {
  placeBid: async (auctionId: string, data: CreateBidInput): Promise<Bid> => {
    const response = await api.post<Bid>(`/auctions/${auctionId}/bids`, data);
    return response.data;
  },

  getBids: async (auctionId: string): Promise<Bid[]> => {
    const response = await api.get<Bid[]>(`/auctions/${auctionId}/bids`);
    return response.data;
  },
};
