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
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { signIn } from '@/lib/actions/auth/signin';
import OrContinueWith from './components/or-continue-witch';
import { FormFieldError } from '@/components/ui/form-field-error';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SigninDto, signinSchema } from '@ascencio/shared/schemas';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SigninFormProps {
  dict: Dictionary;
  lang: string;
}

export function SigninForm({
  className,
  dict,
  lang,
  ...props
}: React.ComponentProps<'form'> & SigninFormProps) {
  const router = useRouter();

  const form = useForm<SigninDto>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: signIn,
  });

  const onSubmit = (data: SigninDto) => {
    mutation.mutateAsync(data, {
      onSuccess: async () => {
        toast.success(dict.signInSuccess, {
          description: dict.signInSuccessDescription,
        });

        setTimeout(() => {
          console.log('Retrasado por 1 segundo.');
          router.push(`/${lang}`);
          router.refresh();
        }, 1000);
      },
      onError(error, variables, onMutateResult, context) {
        console.log('Error during sign-in:', error);
        toast.error(
          typeof error === 'string'
            ? error
            : 'Error signing in. Please try again.',
        );
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{dict.signInScreenTitle}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {dict.signInScreenSubtitle}
          </p>
        </div>

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">{dict.email}</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder={dict['emailPlaceholder']}
                required
                // pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              />
              {fieldState.invalid && (
                <FormFieldError dict={dict} error={fieldState.error} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">{dict.password}</FieldLabel>
                <Link
                  href={`/${lang}/forgot-password`}
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  {dict.forgotPassword}
                </Link>
              </div>
              <Input {...field} id="password" type="password" required />
              {fieldState.invalid && (
                <FormFieldError dict={dict} error={fieldState.error} />
              )}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={mutation.isPending}>
            {dict.signIn}
          </Button>
        </Field>

        <OrContinueWith text={dict.orContinueWith} />

        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              try {
                const base =
                  process.env.NEXT_PUBLIC_API_URL ||
                  'http://localhost:3001/api/v1';
                const u = new URL(base);
                const apiBasePath = u.pathname.replace(/\/$/, '');
                const oauthUrl = `${u.origin}${apiBasePath}/auth/google`;
                window.location.href = oauthUrl;
              } catch (e) {
                console.error('Invalid NEXT_PUBLIC_API_URL', e);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            {dict.signInWithGoogle}
          </Button>
          <FieldDescription className="text-center">
            {dict.dontHaveAccount}{' '}
            <Link href="/signup" className="underline underline-offset-4">
              {dict.signUp}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
