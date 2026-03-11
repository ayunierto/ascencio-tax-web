'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema, type CreateScheduleRequest } from '@ascencio/shared';
import type { Schedule } from '@ascencio/shared/interfaces';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { FormFieldError } from '@/components/ui/form-field-error';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderIcon } from 'lucide-react';
import {
  useCreateSchedule,
  useUpdateSchedule,
} from '@/hooks/use-schedule-mutations';

interface ScheduleFormProps {
  schedule?: Schedule;
  lang: string;
  dict: Dictionary;
}

export function ScheduleForm({ schedule, lang, dict }: ScheduleFormProps) {
  const isEditing = Boolean(schedule);

  const createMutation = useCreateSchedule({ dict, lang });
  const updateMutation = useUpdateSchedule({
    dict,
    lang,
    scheduleId: schedule?.id || '',
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm<CreateScheduleRequest>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      dayOfWeek: schedule?.dayOfWeek ?? 1,
      startTime: schedule?.startTime || '09:00',
      endTime: schedule?.endTime || '17:00',
    },
  });

  const onSubmit = (data: CreateScheduleRequest) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const dayOptions = [
    { value: 0, label: dict.scheduleDaySunday },
    { value: 1, label: dict.scheduleDayMonday },
    { value: 2, label: dict.scheduleDayTuesday },
    { value: 3, label: dict.scheduleDayWednesday },
    { value: 4, label: dict.scheduleDayThursday },
    { value: 5, label: dict.scheduleDayFriday },
    { value: 6, label: dict.scheduleDaySaturday },
  ];

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-3xl mx-auto p-2 sm:p-4 md:p-6"
    >
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-bold">
            {isEditing ? dict.scheduleEditTitle : dict.scheduleNewTitle}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEditing ? dict.scheduleEditSubtitle : dict.scheduleNewSubtitle}
          </p>
        </div>

        <Controller
          name="dayOfWeek"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="dayOfWeek">
                {dict.scheduleDayOfWeekLabel}
              </FieldLabel>
              <Select
                value={String(field.value)}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger id="dayOfWeek" className="w-full">
                  <SelectValue placeholder={dict.scheduleDayPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {dayOptions.map((day) => (
                    <SelectItem key={day.value} value={String(day.value)}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />

        <Controller
          name="startTime"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="startTime">
                {dict.scheduleStartTimeLabel}
              </FieldLabel>
              <Input
                {...field}
                id="startTime"
                type="time"
                aria-invalid={fieldState.invalid}
              />
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />

        <Controller
          name="endTime"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="endTime">
                {dict.scheduleEndTimeLabel}
              </FieldLabel>
              <Input
                {...field}
                id="endTime"
                type="time"
                aria-invalid={fieldState.invalid}
              />
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {dict.reset}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting && (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? dict.scheduleUpdateButton : dict.scheduleCreateButton}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
