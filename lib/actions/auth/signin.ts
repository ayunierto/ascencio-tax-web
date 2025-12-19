'use server';

import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';
import { SigninDto } from '@ascencio/shared';

interface SignInResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function signIn(credentials: SigninDto): Promise<SignInResponse> {
  const { data } = await api.post<SignInResponse>('/auth/signin', credentials);

  const cookieStore = await cookies();

  const cookieDomain = process.env.AUTH_COOKIE_DOMAIN;

  // Configurar cookie httpOnly con el JWT
  cookieStore.set('access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    ...(cookieDomain ? { domain: cookieDomain } : {}),
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });

  return data;
}
