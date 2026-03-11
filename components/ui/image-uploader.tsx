'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUploadSignature, deleteImage } from '@/lib/actions/files';
import type { UploadSignaturePayload } from '@ascencio/shared/interfaces';

interface ImageUploaderProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  folder?: string;
  label?: string;
  disabled?: boolean;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const isUrl = (value?: string) => !!value && value.startsWith('http');

const resolveCloudinaryUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  if (isUrl(value)) return value;
  if (!CLOUDINARY_CLOUD_NAME) return undefined;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${value}`;
};

export function ImageUploader({
  value,
  onChange,
  folder = 'temp_files',
  label,
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    resolveCloudinaryUrl(value),
  );
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tempImageRef = useRef<string | undefined>(undefined);
  const savedRef = useRef<boolean>(false);

  // Sync imageUrl with value
  useEffect(() => {
    setImageUrl(resolveCloudinaryUrl(value));
    if (value && !isUrl(value)) {
      tempImageRef.current = value;
    }
  }, [value]);

  /**
   * Upload image to Cloudinary
   */
  const uploadImage = async (
    file: File,
    signature: UploadSignaturePayload,
  ): Promise<{ secureUrl: string; publicId: string }> => {
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
      throw new Error(json?.error?.message || 'Cloudinary upload failed');
    }

    return {
      secureUrl: json.secure_url as string,
      publicId: json.public_id as string,
    };
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Delete old temp image if exists
      if (tempImageRef.current) {
        try {
          await deleteImage(tempImageRef.current);
        } catch (error) {
          console.error('Error deleting old temp image:', error);
        }
      }

      // Get signature
      const signature = await getUploadSignature(folder);

      // Upload to Cloudinary
      const { secureUrl, publicId } = await uploadImage(file, signature);

      // Track this as temp image
      tempImageRef.current = publicId;

      // Update form value with secure URL (for Zod validation)
      // The backend will extract publicId and promote temp_files to final folder
      onChange(secureUrl);
      setImageUrl(secureUrl);
      setImageError(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Handle delete image
   */
  const handleDelete = async () => {
    if (!value && !tempImageRef.current) return;
    const imageToDelete = tempImageRef.current || value;
    if (!imageToDelete) return;

    setDeleting(true);

    try {
      setImageUrl(undefined);
      onChange(undefined);
      tempImageRef.current = undefined;
      await deleteImage(imageToDelete);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Rollback
      setImageUrl(resolveCloudinaryUrl(value));
      onChange(value);
      alert('Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Cleanup temp image on unmount if not saved
   */
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

  /**
   * Expose markAsSaved method (can be called from parent)
   */
  useEffect(() => {
    // Store in ref for external access if needed
    (window as any).__imageUploaderMarkAsSaved = () => {
      savedRef.current = true;
    };
  }, []);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div className="space-y-2">
        {imageUrl && !imageError ? (
          <div className="relative w-full max-w-xs">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
              onClick={handleDelete}
              disabled={deleting || disabled}
            >
              {deleting ? (
                <Loader2Icon className="h-3 w-3 animate-spin" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading || disabled}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || disabled}
            >
              {uploading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        JPG, PNG or WEBP (max 5MB)
      </p>
    </div>
  );
}
