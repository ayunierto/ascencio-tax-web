import { AppointmentsList } from '@/components/features/appointments/appointments-list';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const metadata = {
  title: 'My Appointments - Ascencio Tax Inc',
  description: 'Manage your appointments',
};

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'es');

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {dict.myAppointments || 'My Appointments'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {dict.manageYourAppointments ||
            'View and manage your scheduled appointments'}
        </p>
      </div>
      <AppointmentsList />
    </div>
  );
}
