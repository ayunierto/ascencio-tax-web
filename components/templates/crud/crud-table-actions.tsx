'use client';

import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { EditIcon, LoaderIcon, Trash2Icon } from 'lucide-react';

interface CrudTableActionsProps {
  editHref: string;
  onDelete: () => void;
  isDeleting: boolean;
  confirmTitle: string;
  confirmDescription: string;
  cancelLabel: string;
  deleteLabel: string;
}

export function CrudTableActions({
  editHref,
  onDelete,
  isDeleting,
  confirmTitle,
  confirmDescription,
  cancelLabel,
  deleteLabel,
}: CrudTableActionsProps) {
  return (
    <>
      <Button variant="ghost" asChild size="sm">
        <Link href={editHref}>
          <EditIcon size={16} />
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <LoaderIcon size={16} color="red" className="animate-spin" />
            ) : (
              <Trash2Icon size={16} color="red" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>
              {deleteLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
