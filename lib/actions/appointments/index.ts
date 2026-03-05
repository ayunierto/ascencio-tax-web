'use server';

import { api } from '@/lib/api/api';
import { authHeaders } from '@/lib/api/withAuth';
import type { Appointment } from '@ascencio/shared/interfaces';

/**
 * Obtiene las citas del usuario actual
 * @param state 'pending' para citas futuras, 'past' para citas pasadas
 */
export async function getCurrentUserAppointments(
  state: 'pending' | 'past' = 'pending',
): Promise<Appointment[]> {
  const headers = await authHeaders();
  const res = await api.get<Appointment[]>('/appointments/current-user', {
    params: { state },
    headers,
    withCredentials: true,
  });
  return res.data;
}

/**
 * Cancela una cita del usuario actual
 */
export async function cancelAppointment(
  id: string,
  reason?: string,
): Promise<Appointment> {
  const headers = await authHeaders();
  const res = await api.patch<Appointment>(
    `/appointments/${id}/cancel`,
    { reason },
    {
      headers,
      withCredentials: true,
    },
  );
  return res.data;
}
