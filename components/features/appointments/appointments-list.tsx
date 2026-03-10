'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Video, XCircle } from 'lucide-react';
import type { Appointment } from '@ascencio/shared/interfaces';
import {
  getCurrentUserAppointments,
  cancelAppointment,
} from '@/lib/actions/appointments';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function AppointmentsList() {
  const router = useRouter();
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(
    [],
  );
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Cargar citas pendientes y pasadas
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const [pending, past] = await Promise.all([
        getCurrentUserAppointments('pending'),
        getCurrentUserAppointments('past'),
      ]);
      setPendingAppointments(pending);
      setPastAppointments(past);
    } catch (error) {
      toast.error('Failed to load appointments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      setCancelingId(selectedAppointment.id);
      await cancelAppointment(selectedAppointment.id, 'Cancelled by user');
      toast.success('Appointment cancelled successfully');
      loadAppointments(); // Recargar lista
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error(error);
    } finally {
      setCancelingId(null);
      setShowCancelDialog(false);
      setSelectedAppointment(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-blue-500',
      confirmed: 'bg-green-500',
      cancelled: 'bg-red-500',
      completed: 'bg-gray-500',
    };

    return (
      <Badge className={statusColors[status.toLowerCase()] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">
              {appointment.service?.name}
            </CardTitle>
            <CardDescription className="mt-1">
              with {appointment.staffMember?.firstName}{' '}
              {appointment.staffMember?.lastName}
            </CardDescription>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(appointment.start)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatTime(appointment.start)} - {formatTime(appointment.end)}
            </span>
          </div>
          {appointment.service?.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.service.address}</span>
            </div>
          )}
          {appointment.zoomMeetingLink && (
            <div className="flex items-center gap-2 text-sm">
              <Video className="h-4 w-4 text-muted-foreground" />
              <a
                href={appointment.zoomMeetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Join Zoom Meeting
              </a>
            </div>
          )}
          {appointment.comments && (
            <div className="mt-3 p-3 bg-muted rounded-md">
              <p className="text-sm">{appointment.comments}</p>
            </div>
          )}
          {appointment.status === 'pending' && (
            <div className="mt-4 flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancelClick(appointment)}
                disabled={cancelingId === appointment.id}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {cancelingId === appointment.id
                  ? 'Cancelling...'
                  : 'Cancel Appointment'}
              </Button>
            </div>
          )}
          {appointment.status === 'cancelled' &&
            appointment.cancellationReason && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Cancellation reason:</strong>{' '}
                  {appointment.cancellationReason}
                </p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">
            Upcoming ({pendingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingAppointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any scheduled appointments yet.
                  </p>
                  <Button onClick={() => router.push('/booking')}>
                    Book an Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            pendingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No past appointments
                  </h3>
                  <p className="text-muted-foreground">
                    Your appointment history will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
