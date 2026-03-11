import { ServiceForm } from '@/components/features/services/service-form';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth/me';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface CreateServicePageProps {
  params: Promise<{ lang: string }>;
}

export default async function CreateServicePage({
  params,
}: CreateServicePageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'es');

  return (
    <div className="container mx-auto py-4 md:py-8">
      <ServiceForm lang={lang} dict={dict} />
    </div>
  );
}
