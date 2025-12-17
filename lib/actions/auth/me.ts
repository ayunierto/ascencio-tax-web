'use server';

import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';

export interface BasicUser {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  email: string;
  countryCode?: string;
  phoneNumber?: string;
  locale: string;
  roles: string[];
  lastLoginAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export async function getCurrentUser(): Promise<BasicUser | null> {
  // Leer el JWT httpOnly desde el servidor de Next
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const res = await api.get<BasicUser>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Asegurar envío de credenciales si el backend las requiere
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    // Si el token no es válido o expiró, devolvemos null
    return null;
  }
}
