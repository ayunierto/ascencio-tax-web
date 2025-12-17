'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOut() {
  const cookieStore = await cookies();
  const cookieDomain = process.env.AUTH_COOKIE_DOMAIN;
  cookieStore.delete({
    name: 'access_token',
    path: '/',
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  });
  redirect('/signin');
}
