import Link from 'next/link';
import Image from 'next/image';
import { Auction } from '@/types';
import { StatusBadge } from './StatusBadge';
import { formatPrice, getTimeRemaining, cn } from '@/lib/utils';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface AuctionCardProps {
  auction: Auction;
  className?: string;
}

export function AuctionCard({ auction, className }: AuctionCardProps) {
  const timeRemaining = getTimeRemaining(auction.endTime);
  const isEnded = auction.status === 'CLOSED';

  return (
    <Link
      href={`/auctions/${auction.id}`}
      className={cn(
        'group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden',
        'hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-56 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        {auction.imageUrl ? (
          <Image
            src={auction.imageUrl}
            alt={auction.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <DollarSign className="w-16 h-16 text-gray-300 dark:text-gray-700" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={auction.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
          {auction.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{auction.description}</p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Current Price</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-500">
              {formatPrice(auction.currentPrice)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">
              {isEnded ? 'Ended' : 'Time Left'}
            </p>
            <p
              className={cn(
                'text-sm font-semibold',
                isEnded ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
              )}
            >
              {timeRemaining}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(auction.createdAt)}</span>
          </div>
          <span className="font-medium">{auction.bids?.length ?? 0} bids</span>
        </div>
      </div>
    </Link>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
