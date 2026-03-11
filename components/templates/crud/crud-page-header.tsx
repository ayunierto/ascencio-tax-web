import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface CrudPageHeaderProps {
  title: string;
  actionHref: string;
  actionLabel: string;
  actionIcon?: ReactNode;
}

export function CrudPageHeader({
  title,
  actionHref,
  actionLabel,
  actionIcon,
}: CrudPageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button asChild>
        <Link href={actionHref}>
          {actionIcon}
          {actionLabel}
        </Link>
      </Button>
    </div>
  );
}
