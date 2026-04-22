import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { auctionService } from '@/services/auction.service';
import { bidService } from '@/services/bid.service';
import { adminService } from '@/services/admin.service';
import type {
  LoginInput,
  RegisterInput,
  CreateAuctionInput,
  UpdateAuctionInput,
  CreateBidInput,
  AuctionFilters,
  RejectAuctionInput,
  User,
  AuthResponse,
} from '@/types';

// ==================== AUTH HOOKS ====================
export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, unknown, LoginInput>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, unknown, RegisterInput>({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });
};

// ==================== AUCTION HOOKS ====================
export const useAuctions = (filters?: AuctionFilters) => {
  return useQuery({
    queryKey: ['auctions', filters],
    queryFn: () => auctionService.getAuctions(filters),
  });
};

export const useAuction = (id: string) => {
  return useQuery({
    queryKey: ['auction', id],
    queryFn: () => auctionService.getAuction(id),
    enabled: !!id,
  });
};

export const useCreateAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: auctionService.createAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
};

export const useUpdateAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuctionInput }) =>
      auctionService.updateAuction(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auction', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
};

export const useDeleteAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: auctionService.deleteAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
};

export const useMyListings = () => {
  return useQuery({
    queryKey: ['myListings'],
    queryFn: auctionService.getMyListings,
  });
};

// ==================== BID HOOKS ====================
export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auctionId, data }: { auctionId: string; data: CreateBidInput }) =>
      bidService.placeBid(auctionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auction', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['bids', variables.auctionId] });
    },
  });
};

export const useBids = (auctionId: string) => {
  return useQuery({
    queryKey: ['bids', auctionId],
    queryFn: () => bidService.getBids(auctionId),
    enabled: !!auctionId,
  });
};

// ==================== ADMIN HOOKS ====================
export const usePendingAuctions = () => {
  return useQuery({
    queryKey: ['pendingAuctions'],
    queryFn: adminService.getPendingAuctions,
  });
};

export const useAdminAuctions = (filters?: AuctionFilters) => {
  return useQuery({
    queryKey: ['adminAuctions', filters],
    queryFn: () => adminService.getAllAuctions(filters),
  });
};

export const useApproveAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.approveAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingAuctions'] });
      queryClient.invalidateQueries({ queryKey: ['adminAuctions'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};

export const useRejectAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: RejectAuctionInput }) =>
      adminService.rejectAuction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingAuctions'] });
      queryClient.invalidateQueries({ queryKey: ['adminAuctions'] });
    },
  });
};
