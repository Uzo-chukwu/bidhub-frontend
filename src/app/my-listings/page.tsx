'use client';

import { useMyListings, useDeleteAuction } from '@/hooks/useApi';
import { AuthGuard } from '@/components/AuthGuard';
import { PageHeader } from '@/components/PageHeader';
import { AuctionCard } from '@/components/AuctionCard';
import { AuctionCardSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { useToast } from '@/providers/ToastProvider';
import { Plus, Package } from 'lucide-react';
import Link from 'next/link';

function MyListingsContent() {
  const toast = useToast();
  const { data: auctions, isLoading, error } = useMyListings();
  const deleteMutation = useDeleteAuction();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this auction?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Auction deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete auction');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <PageHeader
          title="My Listings"
          subtitle="Manage your auctions"
          action={
            <Link
              href="/auctions/create"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Auction
            </Link>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <AuctionCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message="Failed to load your listings" onRetry={() => window.location.reload()} />
        ) : !auctions || auctions.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Create your first auction to start selling"
            icon={<Package className="w-12 h-12" />}
            action={
              <Link
                href="/auctions/create"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Auction
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <div key={auction.id} className="relative">
                <AuctionCard auction={auction} />
                {auction.status === 'PENDING' && (
                  <div className="absolute top-3 left-3 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(auction.id);
                      }}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <AuthGuard>
      <MyListingsContent />
    </AuthGuard>
  );
}
