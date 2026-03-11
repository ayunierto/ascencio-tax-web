import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type {
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from '@ascencio/shared';
import type { Schedule } from '@ascencio/shared/interfaces';
import {
  createSchedule,
  deleteSchedule,
  updateSchedule,
} from '@/lib/actions/schedules';
import { resolveFieldErrorMessage } from '@/components/ui/form-field-error';

interface UseCreateScheduleOptions {
  dict: Dictionary;
  lang: string;
}

export function useCreateSchedule({ dict, lang }: UseCreateScheduleOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => createSchedule(data),
    onSuccess: () => {
      toast.success(dict.scheduleCreatedSuccess);
      router.push(`/${lang}/admin/schedules`);
      router.refresh();
    },
    onError: (error: unknown) => {
      handleScheduleError(error, dict);
    },
  });
}

interface UseUpdateScheduleOptions {
  dict: Dictionary;
  lang: string;
  scheduleId: string;
}

export function useUpdateSchedule({
  dict,
  lang,
  scheduleId,
}: UseUpdateScheduleOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateScheduleRequest) =>
      updateSchedule(scheduleId, data),
    onSuccess: (updated: Schedule) => {
      toast.success(dict.scheduleUpdatedSuccess);
      router.push(`/${lang}/admin/schedules`);
      router.refresh();
      return updated;
    },
    onError: (error: unknown) => {
      handleScheduleError(error, dict);
    },
  });
}

interface UseDeleteScheduleOptions {
  dict: Dictionary;
  onSuccess?: () => void;
}

export function useDeleteSchedule({ dict, onSuccess }: UseDeleteScheduleOptions) {
  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => {
      toast.success(dict.scheduleDeletedSuccess);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleScheduleError(error, dict);
    },
  });
}

function handleScheduleError(error: unknown, dict: Dictionary): void {
  console.error('Schedule operation error:', error);

  if (!isAxiosError(error)) {
    toast.error(dict.errorSavingSchedule);
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
        toast.error(dict.errorSavingSchedule);
      }
  }
}
