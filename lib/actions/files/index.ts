'use server';

import { api } from '@/lib/api/api';
import { authHeaders } from '@/lib/api/withAuth';
import type { UploadSignaturePayload } from '@ascencio/shared/interfaces';

/**
 * Get upload signature for Cloudinary
 * @param folder - Target folder (defaults to 'temp_files')
 */
export async function getUploadSignature(
  folder = 'temp_files',
): Promise<UploadSignaturePayload> {
  const headers = await authHeaders();
  const res = await api.post<UploadSignaturePayload>(
    '/files/signature',
    { folder },
    {
      headers,
      withCredentials: true,
    },
  );
  return res.data;
}

/**
 * Delete an image from Cloudinary by publicId
 * @param publicId - The Cloudinary public_id to delete
 */
export async function deleteImage(publicId: string): Promise<void> {
  const headers = await authHeaders();
  await api.delete(`/files/${encodeURIComponent(publicId)}`, {
    headers,
    withCredentials: true,
  });
}
