import { getCurrentUser } from '@/lib/actions/auth/me';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getSchedule } from '@/lib/actions/schedules';
import { ScheduleForm } from '@/components/features/schedules/schedule-form';
import { notFound, redirect } from 'next/navigation';

interface EditSchedulePageProps {
  params: Promise<{ id: string; lang: string }>;
}

export default async function EditSchedulePage({
  params,
}: EditSchedulePageProps) {
  const { id, lang } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${lang}/signin`);
  }
  const dict = await getDictionary(lang as 'en' | 'es');

  try {
    const schedule = await getSchedule(id);
    return (
      <div className="container mx-auto py-4 md:py-8">
        <ScheduleForm schedule={schedule} lang={lang} dict={dict} />
      </div>
    );
  } catch {
    notFound();
  }
}
