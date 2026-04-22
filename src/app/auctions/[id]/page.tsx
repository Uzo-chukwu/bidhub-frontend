'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuction, usePlaceBid, useBids, useCurrentUser } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import { auctionService } from '@/services/auction.service';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { CountdownTimer } from '@/components/CountdownTimer';
import { FormInput } from '@/components/FormField';
import { useToast } from '@/providers/ToastProvider';
import { formatPrice, formatDate } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bidSchema, CreateBidInput } from '@/types';
import {
  ArrowLeft,
  User,
  Clock,
  DollarSign,
  Gavel,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

export default function AuctionDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const toast = useToast();
  const { data: user } = useCurrentUser();

  const { data: auction, isLoading, error } = useAuction(id);
  const { data: bids } = useBids(id);
  
  // Polling for live updates (every 5 seconds)
  const { data: updatedAuction } = useQuery({
    queryKey: ['auction', id],
    queryFn: () => auctionService.getAuction(id),
    refetchInterval: 5000,
    enabled: !!auction && auction.status === 'APPROVED',
  });
  
  const displayAuction = updatedAuction || auction;
  const placeBidMutation = usePlaceBid();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBidInput>({
    resolver: zodResolver(bidSchema),
  });

  const onSubmit = async (data: CreateBidInput) => {
    try {
      await placeBidMutation.mutateAsync({ auctionId: id, data });
      toast.success('Bid placed successfully!');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place bid');
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="Auction not found" onRetry={() => window.location.reload()} />;
  if (!displayAuction) return null;

  const isOwner = user?.id === displayAuction.sellerId;
  const canBid = !isOwner && displayAuction.status === 'APPROVED' && new Date(displayAuction.endTime) > new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Auctions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            {displayAuction.imageUrl ? (
              <div className="relative h-96">
                <Image
                  src={displayAuction.imageUrl}
                  alt={displayAuction.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-96 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <DollarSign className="w-24 h-24 text-indigo-300" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <StatusBadge status={displayAuction.status} />
                {!isOwner && displayAuction.status === 'APPROVED' && (
                  <CountdownTimer endTime={displayAuction.endTime} />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayAuction.title}</h1>
              <p className="text-gray-600">{displayAuction.description}</p>
            </div>

            {/* Price Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">Current Price</span>
                </div>
                <p className="text-3xl font-bold text-indigo-600">
                  {formatPrice(displayAuction.currentPrice)}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Starting Price</span>
                <span className="font-semibold">{formatPrice(displayAuction.startingPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total Bids</span>
                <span className="font-semibold">{bids?.length || 0}</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="font-semibold text-gray-900">{displayAuction.seller.username}</p>
                </div>
              </div>
            </div>

            {/* Time Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Listed: {formatDate(displayAuction.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Ends: {formatDate(displayAuction.endTime)}
                </span>
              </div>
            </div>

            {/* Place Bid */}
            {!user ? (
              <Link
                href="/login"
                className="block w-full px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-center font-semibold"
              >
                Login to Place Bids
              </Link>
            ) : isOwner ? (
              <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-600">
                You cannot bid on your own auction
              </div>
            ) : displayAuction.status !== 'APPROVED' ? (
              <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-600">
                This auction is {displayAuction.status.toLowerCase()}
              </div>
            ) : new Date(displayAuction.endTime) <= new Date() ? (
              <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-600">
                This auction has ended
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  label="Your Bid Amount"
                  type="number"
                  step="0.01"
                  placeholder={`${parseFloat(displayAuction.currentPrice) + 1}`}
                  error={errors.amount?.message}
                  {...register('amount', { valueAsNumber: true })}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Gavel className="w-5 h-5" />
                  {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bids History */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Bid History ({bids?.length || 0})
          </h2>
          {!bids || bids.length === 0 ? (
            <EmptyState
              title="No bids yet"
              description="Be the first to bid on this item"
              icon={<Gavel className="w-12 h-12" />}
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {bids.map((bid, index) => (
                <div
                  key={bid.id}
                  className={`flex items-center justify-between p-4 ${
                    index !== bids.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Bidder #{index + 1}</p>
                      <p className="text-sm text-gray-500">{formatDate(bid.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-indigo-600">{formatPrice(bid.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
