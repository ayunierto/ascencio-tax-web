import { OTPForm } from '@/components/auth/otp-form';
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
      <div className="relative hidden w-1/2 lg:block">
        <Image
          width={300}
          height={300}
          loading="eager"
          src="/images/logo.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-xs">
          <OTPForm lang={lang} dict={dict} />
        </div>
      </div>
    </div>
  );
}
