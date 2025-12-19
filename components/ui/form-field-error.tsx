'use client';

import type { ComponentProps } from 'react';

import { FieldError as UIFieldError } from '@/components/ui/field';
import type { Dictionary } from '@/lib/i18n/dictionaries';

type ErrorLike = { message?: unknown } | null | undefined;

const DEFAULT_ERROR_FALLBACK = 'Invalid';

export const resolveFieldErrorMessage = (
  dict: Dictionary,
  message?: unknown,
  fallback = DEFAULT_ERROR_FALLBACK,
): string | undefined => {
  if (!message) return fallback;
  if (typeof message === 'string') {
    const key = message as keyof Dictionary;
    return (dict as Record<string, string>)[key] ?? message;
  }
  return fallback;
};

type FormFieldErrorProps = Omit<
  ComponentProps<typeof UIFieldError>,
  'errors'
> & {
  dict: Dictionary;
  error?: ErrorLike;
  fallback?: string;
};

export function FormFieldError({
  dict,
  error,
  fallback = DEFAULT_ERROR_FALLBACK,
  ...props
}: FormFieldErrorProps) {
  const message = resolveFieldErrorMessage(dict, error?.message, fallback);

  if (!message) return null;

  return <UIFieldError {...props} errors={[{ message }]} />;
}
