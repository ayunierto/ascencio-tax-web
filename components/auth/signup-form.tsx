'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { signUpSchema } from '@ascencio/shared/schemas';
import Link from 'next/link';
import OrContinueWith from './components/or-continue-witch';
import { z } from 'zod';

// Extend the schema to include confirmPassword for frontend validation
const signUpFormSchema = signUpSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpFormSchema>;

interface SignupFormProps {
  dict: any;
  lang: string;
}

export function SignupForm({
  className,
  lang,
  dict,
  ...props
}: React.ComponentProps<'form'> & SignupFormProps) {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      countryCode: '',
      phoneNumber: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: lang,
    },
  });

  function onSubmit(data: SignUpFormData) {
    // Do something with the form values.
    console.log(data);
  }

  return (
    <form
      className={cn('flex flex-col gap-2', className)}
      {...props}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{dict.signUpScreenTitle}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {dict.signUpScreenSubtitle}
          </p>
        </div>

        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="firstName">{dict.firstName}</FieldLabel>
              <Input
                {...field}
                id="firstName"
                aria-invalid={fieldState.invalid}
                placeholder={dict.firstNamePlaceholder}
                autoComplete="off"
                required
                minLength={3}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="lastName">{dict.lastName}</FieldLabel>
              <Input
                {...field}
                id="lastName"
                aria-invalid={fieldState.invalid}
                placeholder={dict.lastNamePlaceholder}
                autoComplete="off"
                required
                minLength={3}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">{dict.email}</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder={dict.emailPlaceholder}
                required
              />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">{dict.password}</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="********"
                minLength={8}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">
                {dict.confirmPassword}
              </FieldLabel>
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                placeholder="********"
                required
                minLength={8}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

              <FieldDescription>
                Password must be at least 8 characters
              </FieldDescription>
            </Field>
          )}
        />

        <Field>
          <Button type="submit">{dict.createAccount}</Button>
        </Field>

        <OrContinueWith text={dict.orContinueWith} />

        <Field>
          <Button variant="outline" type="button" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            {dict.signUpWithGoogle} ({dict.comingSoon})
          </Button>
          <FieldDescription className="px-6 text-center">
            {dict.alreadyHaveAccount}{' '}
            <Link href={`/signin`}>{dict.signIn}</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
