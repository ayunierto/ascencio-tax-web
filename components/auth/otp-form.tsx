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

interface OTPFormProps {
  lang: string;
  dict: Dictionary;
}

export function OTPForm({
  className,
  dict,
  lang,
  ...props
}: React.ComponentProps<'div'> & OTPFormProps) {
  const otpSchema = useMemo(
    () =>
      z.object({
        otp: z
          .string()
          .length(6, dict.codeLength)
          .min(1, dict.validationRequired),
      }),
    [dict],
  );
  type OTPDto = z.infer<typeof otpSchema>;

  const form = useForm<OTPDto>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = (data: OTPDto) => {
    console.log(data);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">{dict.otpScreenTitle}</h1>
            <p className="text-muted-foreground text-sm text-balance">
              {dict.otpScreenSubtitle}
            </p>
          </div>
          <Controller
            control={form.control}
            name="otp"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="otp" className="sr-only">
                  {dict.verificationCode}
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
                  {dict.otpScreenDescription}
                </FieldDescription>
              </Field>
            )}
          />
          <Button type="submit">{dict.verify}</Button>
          <FieldDescription className="text-center">
            {dict.didntReceiveCode} <a href="#">{dict.resend}</a>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
