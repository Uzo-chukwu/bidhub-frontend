'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCreateAuction } from '@/hooks/useApi';
import { createAuctionSchema, CreateAuctionInput } from '@/types';
import { FormInput, FormTextarea } from '@/components/FormField';
import { useToast } from '@/providers/ToastProvider';
import { AuthGuard } from '@/components/AuthGuard';
import { PageHeader } from '@/components/PageHeader';
import { Loader2 } from 'lucide-react';

function CreateAuctionContent() {
  const router = useRouter();
  const toast = useToast();
  const createMutation = useCreateAuction();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAuctionInput>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: {
      imageUrl: '',
    },
  });

  const onSubmit = async (data: CreateAuctionInput) => {
    try {
      // Clean up empty imageUrl
      if (!data.imageUrl) {
        delete data.imageUrl;
      }
      await createMutation.mutateAsync(data);
      toast.success('Auction created successfully!');
      router.push('/my-listings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create auction');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <PageHeader
          title="Create Auction"
          subtitle="List your item for bidding"
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
                    Creating...
                  </>
                ) : (
                  'Create Auction'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateAuctionPage() {
  return (
    <AuthGuard>
      <CreateAuctionContent />
    </AuthGuard>
  );
}
