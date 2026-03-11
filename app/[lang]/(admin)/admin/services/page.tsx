import ServicesTable from '@/components/features/services/table';
import { getServices } from '@/lib/actions/services';
import { PlusIcon } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { CrudPageHeader } from '@/components/templates/crud/crud-page-header';

const ServicesPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const services = await getServices({ limit: 20, offset: 0 });
  const dict = await getDictionary(lang as 'en' | 'es');

  return (
    <div className="px-4 space-y-4">
      <CrudPageHeader
        title={`${dict.servicesTitle} (${services.total})`}
        actionHref={`/${lang}/admin/services/create`}
        actionLabel={dict.serviceNew}
        actionIcon={<PlusIcon className="mr-2 h-4 w-4" />}
      />

      <ServicesTable services={services} dict={dict} lang={lang} />
    </div>
  );
};

export default ServicesPage;
