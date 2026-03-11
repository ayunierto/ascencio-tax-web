import { ServiceForm } from '@/components/features/services/service-form';
import { getService } from '@/lib/actions/services';
import { getCurrentUser } from '@/lib/actions/auth/me';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface EditServicePageProps {
  params: Promise<{ id: string; lang: string }>;
}

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  const { id, lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'es');

  try {
    const service = await getService(id);

    return (
      <div className="container mx-auto py-4 md:py-8">
        <ServiceForm service={service} lang={lang} dict={dict} />
      </div>
    );
  } catch (error) {
    console.error('Error loading service:', error);
    notFound();
  }
}
