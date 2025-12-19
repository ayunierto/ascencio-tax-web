import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '@/lib/api/api';

// Optional convenience route for client components to fetch the current user
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  try {
    const res = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return NextResponse.json({ user: res.data }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
