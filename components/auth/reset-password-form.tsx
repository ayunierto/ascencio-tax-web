'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Input } from '../ui/input';
import Link from 'next/link';

interface ResetPasswordFormProps {
  lang: string;
  dict: Dictionary;
}

export function ResetPasswordForm({
  className,
  dict,
  lang,
  ...props
}: React.ComponentProps<'div'> & ResetPasswordFormProps) {
  const resetPasswordSchema = useMemo(
    () =>
      z.object({
        otp: z
          .string()
          .length(6, dict.auth.otp.errors.length)
          .nonempty(dict.auth.otp.errors.required),
        newPassword: z
          .string()
          .min(8, dict.auth.common.errors.passwordMinLength)
          .nonempty(dict.auth.common.errors.required),
      }),

    [dict],
  );
  type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

  const form = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: '',
      newPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordDto) => {
    console.log(data);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">
              {dict.auth.resetPassword.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {dict.auth.resetPassword.subtitle}
            </p>
          </div>
          <Controller
            control={form.control}
            name="otp"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="otp" className="sr-only">
                  {dict.auth.otp.title}
                </FieldLabel>

                <InputOTP {...field} maxLength={6} id="otp" required>
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}

                <FieldDescription className="text-center">
                  {dict.auth.otp.otpDescription}
                </FieldDescription>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <Field className="mt-4" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="newPassword">
                  {dict.auth.resetPassword.newPassword}
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  id="newPassword"
                  placeholder={dict.auth.resetPassword.newPasswordPlaceholder}
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit">{dict.auth.otp.verify}</Button>
          <FieldDescription className="text-center">
            {dict.auth.otp.didntReceiveCode}{' '}
            <Link href={`/${lang}/forgot-password`}>
              {dict.auth.otp.resend}
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
