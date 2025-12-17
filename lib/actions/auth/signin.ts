'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/lib/api/api';

interface SignInData {
  email: string;
  password: string;
}

interface SignInResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function signIn(data: SignInData) {
  try {
    const response = await api.post<SignInResponse>('/auth/signin', data);

    const cookieStore = await cookies();

    const cookieDomain = process.env.AUTH_COOKIE_DOMAIN;

    // Configurar cookie httpOnly con el JWT
    cookieStore.set('access_token', response.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    return { success: true, user: response.data.user };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al iniciar sesión',
    };
  }
}
