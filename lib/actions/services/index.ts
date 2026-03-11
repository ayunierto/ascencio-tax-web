'use server';

import { api } from '@/lib/api/api';
import { authHeaders } from '@/lib/api/withAuth';
import type {
  Service,
  PaginatedResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
} from '@ascencio/shared';

export interface Pagination {
  limit?: number;
  offset?: number;
}

export async function getServices(
  params: Pagination = {},
): Promise<PaginatedResponse<Service>> {
  const headers = await authHeaders();
  const res = await api.get<PaginatedResponse<Service>>('/services', {
    params,
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function getService(id: string): Promise<Service> {
  const headers = await authHeaders();
  const res = await api.get(`/services/${id}`, {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function createService(dto: CreateServiceRequest) {
  const headers = await authHeaders();
  const res = await api.post('/services', dto, {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function updateService(id: string, dto: UpdateServiceRequest) {
  const headers = await authHeaders();
  const res = await api.patch(`/services/${id}`, dto, {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function deleteService(id: string) {
  const headers = await authHeaders();
  const res = await api.delete(`/services/${id}`, {
    headers,
    withCredentials: true,
  });
  return res.data;
}
