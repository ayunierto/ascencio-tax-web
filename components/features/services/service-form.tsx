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

  const imageMessages = {
    uploadButton: dict.imageUploadButton,
    uploading: dict.imageUploading,
    fileTypeError: dict.imageFileTypeError,
    fileSizeError: dict.imageFileSizeError,
    uploadError: dict.imageUploadError,
    deleteError: dict.imageDeleteError,
    previewAlt: dict.imagePreviewAlt,
    helperText: dict.imageHelperText,
  };

  const form = useForm<CreateServiceRequest>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      address: service?.address || '',
      durationMinutes: service?.durationMinutes || 60,
      isAvailableOnline: service?.isAvailableOnline || false,
      imageUrl: service?.imageUrl || undefined,
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
            {isEditing ? dict.serviceEditTitle : dict.serviceNewTitle}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEditing ? dict.serviceEditSubtitle : dict.serviceNewSubtitle}
          </p>
        </div>

        {/* Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">{dict.serviceNameLabel} *</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder={dict.serviceNamePlaceholder}
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
              <FieldLabel htmlFor="description">
                {dict.serviceDescriptionLabel}
              </FieldLabel>
              <Textarea
                {...field}
                id="description"
                placeholder={dict.serviceDescriptionPlaceholder}
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
              <FieldLabel htmlFor="address">
                {dict.serviceAddressLabel}
              </FieldLabel>
              <Input
                {...field}
                id="address"
                placeholder={dict.serviceAddressPlaceholder}
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
                {dict.serviceDurationLabel}
              </FieldLabel>
              <Input
                {...field}
                id="durationMinutes"
                type="number"
                min="1"
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const parsedValue =
                    rawValue === '' ? undefined : Number(rawValue);
                  field.onChange(
                    Number.isNaN(parsedValue as number)
                      ? undefined
                      : parsedValue,
                  );
                }}
                placeholder={dict.serviceDurationPlaceholder}
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
                label={dict.serviceImageLabel}
                messages={imageMessages}
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
                  {dict.serviceAvailableOnlineLabel}
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
                <FieldLabel htmlFor="isActive">
                  {dict.serviceActiveLabel}
                </FieldLabel>
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
              <FieldLabel htmlFor="staffIds">
                {dict.serviceStaffLabel} *
              </FieldLabel>
              {loadingStaff ? (
                <div className="flex items-center justify-center p-4 border rounded-md">
                  <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">
                    {dict.serviceStaffLoading}
                  </span>
                </div>
              ) : (
                <MultiSelect
                  values={field.value || []}
                  onValuesChange={field.onChange}
                >
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue
                      placeholder={dict.serviceStaffPlaceholder}
                    />
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
                {dict.serviceStaffHint}
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
            {dict.cancel}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting && (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? dict.serviceUpdateButton : dict.serviceCreateButton}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
