'use server';

import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getSession(): Promise<{ user: User | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');

    if (!token) {
      return { user: null };
    }

    // Verificar token con el backend
    const response = await api.get<User>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    return { user: response.data };
  } catch (error) {
    return { user: null };
  }
}
