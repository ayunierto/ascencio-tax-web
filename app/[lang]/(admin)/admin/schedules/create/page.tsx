import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth/me';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { ScheduleForm } from '@/components/features/schedules/schedule-form';

interface CreateSchedulePageProps {
  params: Promise<{ lang: string }>;
}

export default async function CreateSchedulePage({
  params,
}: CreateSchedulePageProps) {
  const { lang } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${lang}/signin`);
  }

  const dict = await getDictionary(lang as 'en' | 'es');

  return (
    <div className="container mx-auto py-4 md:py-8">
      <ScheduleForm lang={lang} dict={dict} />
    </div>
  );
}
