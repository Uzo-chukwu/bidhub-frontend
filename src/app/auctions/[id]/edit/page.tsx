'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useAuction, useUpdateAuction } from '@/hooks/useApi';
import { createAuctionSchema, CreateAuctionInput } from '@/types';
import { FormInput, FormTextarea } from '@/components/FormField';
import { useToast } from '@/providers/ToastProvider';
import { AuthGuard } from '@/components/AuthGuard';
import { PageHeader } from '@/components/PageHeader';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/EmptyState';
import { Loader2 } from 'lucide-react';

function EditAuctionContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const toast = useToast();

  const { data: auction, isLoading, error } = useAuction(id);
  const updateMutation = useUpdateAuction();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAuctionInput>({
    resolver: zodResolver(createAuctionSchema),
  });

  useEffect(() => {
    if (auction) {
      reset({
        title: auction.title,
        description: auction.description,
        startingPrice: parseFloat(auction.startingPrice),
        endTime: new Date(auction.endTime).toISOString().slice(0, 16),
        imageUrl: auction.imageUrl || '',
      });
    }
  }, [auction, reset]);

  const onSubmit = async (data: CreateAuctionInput) => {
    try {
      if (!data.imageUrl) {
        delete data.imageUrl;
      }
      await updateMutation.mutateAsync({ id, data });
      toast.success('Auction updated successfully!');
      router.push('/my-listings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update auction');
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="Auction not found" />;
  if (!auction) return null;

  if (auction.status !== 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-800 font-medium">
              This auction cannot be edited because it is {auction.status.toLowerCase()}
            </p>
            <button
              onClick={() => router.push('/my-listings')}
              className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Back to My Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <PageHeader
          title="Edit Auction"
          subtitle="Update your auction details"
        />

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="Title"
              type="text"
              placeholder="What are you selling?"
              error={errors.title?.message}
              {...register('title')}
            />

            <FormTextarea
              label="Description"
              rows={5}
              placeholder="Describe your item in detail..."
              error={errors.description?.message}
              {...register('description')}
            />

            <FormInput
              label="Starting Price ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.startingPrice?.message}
              {...register('startingPrice', { valueAsNumber: true })}
            />

            <FormInput
              label="End Date & Time"
              type="datetime-local"
              error={errors.endTime?.message}
              {...register('endTime')}
            />

            <FormInput
              label="Image URL (optional)"
              type="url"
              placeholder="https://example.com/image.jpg"
              error={errors.imageUrl?.message}
              {...register('imageUrl')}
            />

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Auction'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function EditAuctionPage() {
  return (
    <AuthGuard>
      <EditAuctionContent />
    </AuthGuard>
  );
}
