'use server';

import { api } from '@/lib/api/api';
import { authHeaders } from '@/lib/api/withAuth';
import type { StaffMember } from '@ascencio/shared/interfaces';

export async function getStaffMembers(): Promise<StaffMember[]> {
  const headers = await authHeaders();
  const res = await api.get<StaffMember[]>('/staff-members', {
    headers,
    withCredentials: true,
  });
  return res.data;
}
