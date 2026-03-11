'use server';

import { api } from '@/lib/api/api';
import { authHeaders } from '@/lib/api/withAuth';
import type { CreateScheduleRequest, UpdateScheduleRequest } from '@ascencio/shared';
import type { Schedule } from '@ascencio/shared/interfaces';

export async function getSchedules(): Promise<Schedule[]> {
  const headers = await authHeaders();
  const res = await api.get<Schedule[]>('/schedules', {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function getSchedule(id: string): Promise<Schedule> {
  const headers = await authHeaders();
  const res = await api.get(`/schedules/${id}`, {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function createSchedule(dto: CreateScheduleRequest) {
  const headers = await authHeaders();
  const res = await api.post('/schedules', dto, {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function updateSchedule(id: string, dto: UpdateScheduleRequest) {
  const headers = await authHeaders();
  const res = await api.patch(`/schedules/${id}`, dto, {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function deleteSchedule(id: string) {
  const headers = await authHeaders();
  const res = await api.delete(`/schedules/${id}`, {
    headers,
    withCredentials: true,
  });
  return res.data;
}
