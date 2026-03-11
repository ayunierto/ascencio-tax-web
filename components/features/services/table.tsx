'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Service, PaginatedResponse } from '@ascencio/shared';
import {
  EditIcon,
  EyeOff,
  Trash2Icon,
  VideoIcon,
  VideoOff,
  LoaderIcon,
} from 'lucide-react';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { deleteService } from '@/lib/actions/services';

interface ServicesTableProps {
  services: PaginatedResponse<Service>;
}

const ServicesTable: React.FC<ServicesTableProps> = ({ services }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteService(id);
      router.refresh();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
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
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Online</TableHead>
            <TableHead>State</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services &&
            services.items.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <img
                    src={service.imageUrl || 'https://placehold.co/150'}
                    alt="service image"
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.durationMinutes} min</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {service.isAvailableOnline ? (
                      <>
                        <VideoIcon size={16} className="mr-1 text-green-500" />
                        Online
                      </>
                    ) : (
                      <VideoOff size={16} className="mr-1 text-red-500" />
                    )}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {service.isActive ? (
                      <>
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="fill-green-500 dark:fill-green-400" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <Button variant="ghost" asChild size={'sm'}>
                    <Link href={`/admin/services/${service.id}`}>
                      <EditIcon size={16} />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size={'sm'}
                        className="cursor-pointer"
                        disabled={deletingId === service.id}
                      >
                        {deletingId === service.id ? (
                          <LoaderIcon
                            size={16}
                            color="red"
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2Icon size={16} color="red" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the service &quot;{service.name}&quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(service.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesTable;
