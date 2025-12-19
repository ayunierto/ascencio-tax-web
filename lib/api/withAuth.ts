'use server';

/**
 * Returns authentication headers using the 'access_token' token stored in the server's cookies.
 *
 * @remarks
 * Call Next.js cookies() in the server context to read the 'access_token' cookie.
 * If the token exists, constructs and returns { Authorization: `Bearer ${token}` }.
 * If there is no token, it returns an empty object.
 *
 * @async
 * @returns {Promise<Record<string, string>>} An object with the Authorization header or an empty object if there is no token.
 *
 * @example
 * const headers = await authHeaders();
 */

import { cookies } from 'next/headers';

export async function authHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
