'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { useMemo } from 'react';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface ForgotPasswordFormProps {
  dict: Dictionary;
  lang: string;
}

export function ForgotPasswordForm({
  className,
  dict,
  lang,
  ...props
}: React.ComponentProps<'form'> & ForgotPasswordFormProps) {
  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z.email({ message: dict.auth.common.errors.invalidEmail }),
      }),
    [dict],
  );

  type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

  const form = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordDto) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {dict.auth.forgotPassword.title}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            {dict.auth.forgotPassword.subtitle}
          </p>
        </div>

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">{dict.auth.common.email}</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder={dict.auth.common.emailPlaceholder}
                required
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit">{dict.auth.forgotPassword.title}</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
