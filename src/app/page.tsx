'use client';

import { useState } from 'react';
import { useAuctions } from '@/hooks/useApi';
import { AuctionCard } from '@/components/AuctionCard';
import { AuctionCardSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { Search, Filter } from 'lucide-react';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = useAuctions({
    search: search || undefined,
    page,
    limit,
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Unique Auctions</h1>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">
            Bid on amazing items from sellers worldwide
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auctions Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <PageHeader
          title="Featured Auctions"
          subtitle={`${data?.total || 0} auctions available`}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <AuctionCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message="Failed to load auctions" onRetry={() => window.location.reload()} />
        ) : !data?.data || data.data.length === 0 ? (
          <EmptyState
            title="No auctions found"
            description="Check back later for new listings"
            icon={<Filter className="w-12 h-12" />}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === i + 1
                        ? 'bg-blue-600 text-white dark:bg-blue-600'
                        : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
