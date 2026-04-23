'use client';

import { useState } from 'react';
import {
  usePendingAuctions,
  useApproveAuction,
  useRejectAuction,
  useAdminAuctions,
} from '@/hooks/useApi';
import { AdminGuard } from '@/components/AdminGuard';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { useToast } from '@/providers/ToastProvider';
import { formatPrice, formatDate } from '@/lib/utils';
import type { AuctionStatus } from '@/types';
import {
  CheckCircle,
  XCircle,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Filter,
} from 'lucide-react';

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | undefined>();
  const toast = useToast();

  const {
    data: pendingAuctions,
    isLoading: pendingLoading,
  } = usePendingAuctions();

  const {
    data: allAuctionsData,
    isLoading: allLoading,
  } = useAdminAuctions({ status: statusFilter });

  const approveMutation = useApproveAuction();
  const rejectMutation = useRejectAuction();

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success('Auction approved successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve auction');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      await rejectMutation.mutateAsync({
        id,
        data: { rejectionReason: reason || undefined },
      });
      toast.success('Auction rejected');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject auction');
    }
  };

  const auctions = activeTab === 'pending' ? pendingAuctions : allAuctionsData?.data;
  const isLoading = activeTab === 'pending' ? pendingLoading : allLoading;

  const stats = {
    total: allAuctionsData?.total || 0,
    pending: pendingAuctions?.length || 0,
    approved: allAuctionsData?.data.filter((a) => a.status === 'APPROVED').length || 0,
    rejected: allAuctionsData?.data.filter((a) => a.status === 'REJECTED').length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage and review auctions"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-6 h-6 text-indigo-600" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Filter className="w-6 h-6 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Pending</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Approved</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Rejected</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Review ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Auctions
            </button>
          </div>

          {activeTab === 'all' && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter(undefined)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !statusFilter
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {(['PENDING', 'APPROVED', 'REJECTED', 'CLOSED'] as AuctionStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Auctions List */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : !auctions || auctions.length === 0 ? (
          <EmptyState
            title="No auctions found"
            description={activeTab === 'pending' ? 'No pending auctions to review' : 'No auctions match your filters'}
            icon={<Package className="w-12 h-12" />}
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{auction.title}</h3>
                      <StatusBadge status={auction.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {auction.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatPrice(auction.currentPrice)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{auction.bids?.length ?? 0} bids</span>
                      </div>
                      <div>
                        <span className="font-medium">Seller:</span> {auction.seller.username}
                      </div>
                      <div>
                        <span className="font-medium">Ends:</span> {formatDate(auction.endTime)}
                      </div>
                    </div>
                    {auction.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <span className="font-semibold">Rejection Reason:</span>{' '}
                          {auction.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {auction.status === 'PENDING' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(auction.id)}
                        disabled={approveMutation.isPending}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(auction.id)}
                        disabled={rejectMutation.isPending}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
