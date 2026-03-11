'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Service, PaginatedResponse } from '@ascencio/shared';
import { EyeOff, VideoIcon, VideoOff } from 'lucide-react';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { useDeleteService } from '@/hooks/use-service-mutations';
import { CrudTableActions } from '@/components/templates/crud/crud-table-actions';

interface ServicesTableProps {
  services: PaginatedResponse<Service>;
  dict: Dictionary;
  lang: string;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
  dict,
  lang,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteMutation = useDeleteService({
    dict,
    onSuccess: () => router.refresh(),
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-hidden border rounded-lg">
      <Table className="overflow-hidden border rounded-lg">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}

        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>{dict.serviceTableImage}</TableHead>
            <TableHead>{dict.serviceTableName}</TableHead>
            <TableHead>{dict.serviceTableDuration}</TableHead>
            <TableHead>{dict.serviceTableOnline}</TableHead>
            <TableHead>{dict.serviceTableState}</TableHead>
            <TableHead className="text-center">{dict.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services &&
            services.items.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <img
                    src={service.imageUrl || 'https://placehold.co/150'}
                    alt={dict.serviceImageAlt}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>
                  {service.durationMinutes} {dict.serviceMinutesShort}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {service.isAvailableOnline ? (
                      <>
                        <VideoIcon size={16} className="mr-1 text-green-500" />
                        {dict.serviceOnline}
                      </>
                    ) : (
                      <>
                        <VideoOff size={16} className="mr-1 text-red-500" />
                        {dict.serviceOffline}
                      </>
                    )}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {service.isActive ? (
                      <>
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                        {dict.serviceActive}
                      </>
                    ) : (
                      <>
                        <EyeOff className="fill-green-500 dark:fill-green-400" />
                        {dict.serviceInactive}
                      </>
                    )}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <CrudTableActions
                    editHref={`/${lang}/admin/services/${service.id}`}
                    onDelete={() => handleDelete(service.id)}
                    isDeleting={deletingId === service.id}
                    confirmTitle={dict.serviceDeleteConfirmTitle}
                    confirmDescription={`${dict.serviceDeleteConfirmDesc} "${service.name}".`}
                    cancelLabel={dict.cancel}
                    deleteLabel={dict.delete}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesTable;
