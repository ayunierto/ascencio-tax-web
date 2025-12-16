import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Image from 'next/image';

export default async function OTPPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'es');

  return (
    <div className="flex min-h-svh w-full">
      <div className="flex w-full items-center justify-center p-6 ">
        <div className="w-full max-w-xs">
          <ResetPasswordForm lang={lang} dict={dict} />
        </div>
      </div>
    </div>
  );
}
