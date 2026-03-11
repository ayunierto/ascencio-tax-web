import { CrudPageHeader } from '@/components/templates/crud/crud-page-header';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getSchedules } from '@/lib/actions/schedules';
import { SchedulesTable } from '@/components/features/schedules/schedules-table';

const SchedulesPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'es');
  const schedules = await getSchedules();

  return (
    <div className="px-4 space-y-4">
      <CrudPageHeader
        title={`${dict.schedulesTitle} (${schedules.length})`}
        actionHref={`/${lang}/admin/schedules/create`}
        actionLabel={dict.scheduleNew}
      />
      <SchedulesTable schedules={schedules} dict={dict} lang={lang} />
    </div>
  );
};

export default SchedulesPage;
