'use client';

import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type CreateServiceRequest } from '@ascencio/shared';
import type { Service } from '@ascencio/shared/interfaces';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { FormFieldError } from '@/components/ui/form-field-error';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUploader } from '@/components/ui/image-uploader';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select';
import { LoaderIcon } from 'lucide-react';
import {
  useCreateService,
  useUpdateService,
  useStaffMembers,
} from '@/hooks/use-service-mutations';

interface ServiceFormProps {
  service?: Service;
  lang: string;
  dict: Dictionary;
}

export function ServiceForm({ service, lang, dict }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!service;

  // TanStack Query hooks
  const { data: staffMembers = [], isLoading: loadingStaff } =
    useStaffMembers();

  const createMutation = useCreateService({ dict, lang });
  const updateMutation = useUpdateService({
    dict,
    lang,
    serviceId: service?.id || '',
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm<CreateServiceRequest>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      address: service?.address || '',
      durationMinutes: service?.durationMinutes || 60,
      isAvailableOnline: service?.isAvailableOnline || false,
      imageUrl: service?.imageUrl || '',
      isActive: service?.isActive ?? true,
      staffIds: service?.staffMembers?.map((s) => s.id) || [],
    },
  });

  const onSubmit = (data: CreateServiceRequest) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6"
    >
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-bold">
            {isEditing ? 'Edit Service' : 'New Service'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEditing
              ? 'Update service information'
              : 'Add a new service to your business'}
          </p>
        </div>

        {/* Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Service Name *</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="Tax Consultation"
                aria-invalid={fieldState.invalid}
                required
              />
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...field}
                id="description"
                placeholder="Detailed description of the service..."
                rows={4}
                aria-invalid={fieldState.invalid}
              />
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />

        {/* Address */}
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input
                {...field}
                id="address"
                placeholder="123 Main St, City, State"
                aria-invalid={fieldState.invalid}
              />
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />

        {/* Duration */}
        <Controller
          name="durationMinutes"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="durationMinutes">
                Duration (minutes)
              </FieldLabel>
              <Input
                {...field}
                id="durationMinutes"
                type="number"
                min="1"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                placeholder="60"
                aria-invalid={fieldState.invalid}
              />
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />

        {/* Image Upload */}
        <Controller
          name="imageUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
                folder="temp_files"
                label="Service Image"
                disabled={isSubmitting}
              />
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />

        {/* Available Online */}
        <Controller
          name="isAvailableOnline"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="isAvailableOnline">
                  Available Online
                </FieldLabel>
                <Switch
                  id="isAvailableOnline"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            </Field>
          )}
        />

        {/* Active */}
        <Controller
          name="isActive"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="isActive">Active</FieldLabel>
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            </Field>
          )}
        />

        {/* Staff Members */}
        <Controller
          name="staffIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="staffIds">Staff Members *</FieldLabel>
              {loadingStaff ? (
                <div className="flex items-center justify-center p-4 border rounded-md">
                  <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading staff members...
                  </span>
                </div>
              ) : (
                <MultiSelect
                  values={field.value || []}
                  onValuesChange={field.onChange}
                >
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select staff members..." />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    {staffMembers.map((staff) => (
                      <MultiSelectItem key={staff.id} value={staff.id}>
                        {staff.firstName} {staff.lastName}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Select at least one staff member who can provide this service.
              </p>
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting && (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
