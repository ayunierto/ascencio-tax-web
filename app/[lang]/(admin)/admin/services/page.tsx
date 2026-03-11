import ServicesTable from '@/components/features/services/table';
import { getServices } from '@/lib/actions/services';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const ServicesPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const services = await getServices({ limit: 10, offset: 0 });

  return (
    <div className="px-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Services ({services.total})</h1>
        <Button asChild>
          <Link href={`/${lang}/admin/services/create`}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Service
          </Link>
        </Button>
      </div>

      <ServicesTable services={services} />
    </div>
  );
};

export default ServicesPage;
