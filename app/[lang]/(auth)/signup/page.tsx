import Image from 'next/image';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { SignupForm } from '@/components/auth/signup-form';
import Link from 'next/link';

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'es');

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          width={300}
          height={300}
          loading="eager"
          src="/images/logo.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-10 items-center justify-center rounded-xl overflow-hidden">
              <Image
                width={100}
                height={100}
                loading="eager"
                src="/images/simple-logo.png"
                alt="Logo"
                className="size-10"
              />
            </div>
            {process.env.NEXT_PUBLIC_COMPANY_NAME}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm dict={dict} lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
}
