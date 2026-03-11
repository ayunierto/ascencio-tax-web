'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CrudTableActions } from '@/components/templates/crud/crud-table-actions';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Schedule } from '@ascencio/shared/interfaces';
import { useDeleteSchedule } from '@/hooks/use-schedule-mutations';

interface SchedulesTableProps {
  schedules: Schedule[];
  dict: Dictionary;
  lang: string;
}

export function SchedulesTable({ schedules, dict, lang }: SchedulesTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteMutation = useDeleteSchedule({
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

  const dayLabels: Record<number, string> = {
    0: dict.scheduleDaySunday,
    1: dict.scheduleDayMonday,
    2: dict.scheduleDayTuesday,
    3: dict.scheduleDayWednesday,
    4: dict.scheduleDayThursday,
    5: dict.scheduleDayFriday,
    6: dict.scheduleDaySaturday,
  };

  return (
    <div className="overflow-hidden border rounded-lg">
      <Table className="overflow-hidden border rounded-lg">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>{dict.scheduleTableDay}</TableHead>
            <TableHead>{dict.scheduleTableStart}</TableHead>
            <TableHead>{dict.scheduleTableEnd}</TableHead>
            <TableHead className="text-center">{dict.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{dayLabels[schedule.dayOfWeek]}</TableCell>
              <TableCell>{schedule.startTime}</TableCell>
              <TableCell>{schedule.endTime}</TableCell>
              <TableCell className="text-center">
                <CrudTableActions
                  editHref={`/${lang}/admin/schedules/${schedule.id}`}
                  onDelete={() => handleDelete(schedule.id)}
                  isDeleting={deletingId === schedule.id}
                  confirmTitle={dict.scheduleDeleteConfirmTitle}
                  confirmDescription={`${dict.scheduleDeleteConfirmDesc} "${schedule.startTime} - ${schedule.endTime}".`}
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
}
