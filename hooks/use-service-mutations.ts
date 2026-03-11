/**
 * Services mutation hooks using TanStack Query
 * Follows single responsibility principle - each hook has one job
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type {
  CreateServiceRequest,
  UpdateServiceRequest,
} from '@ascencio/shared';
import type { Service, StaffMember } from '@ascencio/shared/interfaces';
import {
  createService,
  deleteService,
  updateService,
} from '@/lib/actions/services';
import { getStaffMembers } from '@/lib/actions/staff-members';
import { resolveFieldErrorMessage } from '@/components/ui/form-field-error';
import { prepareImageUrlForServer } from '@/lib/utils/cloudinary';

interface UseCreateServiceOptions {
  dict: Dictionary;
  lang: string;
}

/**
 * Hook for creating a new service
 */
export function useCreateService({ dict, lang }: UseCreateServiceOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateServiceRequest) => {
      const submitData = {
        ...data,
        imageUrl: prepareImageUrlForServer(data.imageUrl),
      };

      return createService(submitData);
    },
    onSuccess: () => {
      toast.success(dict.serviceCreatedSuccess);
      router.push(`/${lang}/admin/services`);
      router.refresh();
    },
    onError: (error: unknown) => {
      handleServiceError(error, dict);
    },
  });
}

interface UseUpdateServiceOptions {
  dict: Dictionary;
  lang: string;
  serviceId: string;
}

/**
 * Hook for updating an existing service
 */
export function useUpdateService({
  dict,
  lang,
  serviceId,
}: UseUpdateServiceOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: UpdateServiceRequest) => {
      const submitData = {
        ...data,
        imageUrl: prepareImageUrlForServer(data.imageUrl),
      };

      return updateService(serviceId, submitData);
    },
    onSuccess: () => {
      toast.success(dict.serviceUpdatedSuccess);
      router.push(`/${lang}/admin/services`);
      router.refresh();
    },
    onError: (error: unknown) => {
      handleServiceError(error, dict);
    },
  });
}

interface UseDeleteServiceOptions {
  dict: Dictionary;
  onSuccess?: () => void;
}

/**
 * Hook for deleting a service
 */
export function useDeleteService({ dict, onSuccess }: UseDeleteServiceOptions) {
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      toast.success(dict.serviceDeletedSuccess);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleServiceError(error, dict);
    },
  });
}

/**
 * Hook for loading staff members
 */
export function useStaffMembers() {
  return useQuery<StaffMember[]>({
    queryKey: ['staff-members'],
    queryFn: getStaffMembers,
  });
}

/**
 * Centralized error handler for service operations
 * Single responsibility: handle and display errors
 */
function handleServiceError(error: unknown, dict: Dictionary): void {
  console.error('Service operation error:', error);

  if (!isAxiosError(error)) {
    toast.error(dict.errorSavingService);
    return;
  }

  const status = error.response?.status;
  const message = error.response?.data?.message;

  switch (status) {
    case 403:
      toast.error(dict.forbidden);
      break;

    case 401:
      toast.error(dict.unauthorized);
      break;

    case 500:
      toast.error(dict.internalServerError);
      break;

    default:
      if (message) {
        const translatedMessage = resolveFieldErrorMessage(
          dict,
          message,
          message,
        );
        toast.error(translatedMessage);
      } else {
        toast.error(dict.errorSavingService);
      }
  }
}
