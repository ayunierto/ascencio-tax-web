'use client';

import { useEffect, useRef, useState } from 'react';
import { deleteImage, getUploadSignature } from '@/lib/actions/files';
import {
  extractPublicIdFromUrl,
  isHttpUrl,
  resolveCloudinaryUrl,
} from '@/lib/utils/cloudinary';
import type { UploadSignaturePayload } from '@ascencio/shared/interfaces';

interface ImageUploaderMessages {
  uploadButton: string;
  uploading: string;
  fileTypeError: string;
  fileSizeError: string;
  uploadError: string;
  deleteError: string;
  previewAlt: string;
  helperText: string;
}

interface UseImageUploaderOptions {
  value?: string;
  onChange: (value: string | undefined) => void;
  folder?: string;
  messages: ImageUploaderMessages;
}

interface UploadSuccess {
  ok: true;
  secureUrl: string;
  publicId: string;
}

interface UploadFailure {
  ok: false;
  message?: string;
}

type UploadResult = UploadSuccess | UploadFailure;

export function useImageUploader({
  value,
  onChange,
  folder = 'temp_files',
  messages,
}: UseImageUploaderOptions) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    resolveCloudinaryUrl(value),
  );
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tempImageRef = useRef<string | undefined>(undefined);
  const savedRef = useRef<boolean>(false);

  useEffect(() => {
    setImageUrl(resolveCloudinaryUrl(value));
    if (value && !isHttpUrl(value)) {
      tempImageRef.current = value;
    }
  }, [value]);

  const uploadImage = async (
    file: File,
    signature: UploadSignaturePayload,
  ): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', String(signature.timestamp));
    formData.append('signature', signature.signature);
    formData.append('public_id', signature.publicId);
    formData.append('folder', signature.folder);

    const response = await fetch(signature.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        message: json?.error?.message,
      };
    }

    return {
      ok: true,
      secureUrl: json.secure_url as string,
      publicId: json.public_id as string,
    };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(messages.fileTypeError);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(messages.fileSizeError);
      return;
    }

    setUploading(true);

    try {
      if (tempImageRef.current) {
        try {
          await deleteImage(tempImageRef.current);
        } catch (error) {
          console.error('Error deleting old temp image:', error);
        }
      }

      const signature = await getUploadSignature(folder);
      const result = await uploadImage(file, signature);

      if (!result.ok) {
        console.error('Error uploading image:', result.message);
        alert(messages.uploadError);
        return;
      }

      tempImageRef.current = result.publicId;
      onChange(result.secureUrl);
      setImageUrl(result.secureUrl);
      setImageError(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(messages.uploadError);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!value && !tempImageRef.current) return;
    const previousValue = value;
    const tempPublicId = tempImageRef.current;
    const valuePublicId = value?.startsWith('temp_files/')
      ? value
      : value && isHttpUrl(value) && value.includes('/temp_files/')
        ? extractPublicIdFromUrl(value) || undefined
        : undefined;
    const imageToDelete = tempPublicId || valuePublicId;

    setDeleting(true);

    try {
      setImageUrl(undefined);
      onChange('');
      tempImageRef.current = undefined;
      if (imageToDelete) {
        await deleteImage(imageToDelete);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setImageUrl(resolveCloudinaryUrl(previousValue));
      onChange(previousValue);
      alert(messages.deleteError);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    return () => {
      const currentTemp = tempImageRef.current;
      if (
        currentTemp &&
        !savedRef.current &&
        currentTemp.startsWith('temp_files/')
      ) {
        deleteImage(currentTemp).catch((error) => {
          console.error('Error cleaning up temp image on unmount:', error);
        });
      }
    };
  }, []);

  const markAsSaved = () => {
    savedRef.current = true;
  };

  return {
    deleting,
    fileInputRef,
    handleDelete,
    handleFileSelect,
    imageError,
    imageUrl,
    markAsSaved,
    setImageError,
    uploading,
  };
}
