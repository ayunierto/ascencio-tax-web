'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { X, Upload, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUploader } from '@/hooks/use-image-uploader';

interface ImageUploaderProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  folder?: string;
  label?: string;
  disabled?: boolean;
  messages: ImageUploaderMessages;
}

export interface ImageUploaderHandle {
  markAsSaved: () => void;
}

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

export const ImageUploader = forwardRef<
  ImageUploaderHandle,
  ImageUploaderProps
>(function ImageUploader(
  { value, onChange, folder = 'temp_files', label, disabled = false, messages },
  ref,
) {
  const {
    deleting,
    fileInputRef,
    handleDelete,
    handleFileSelect,
    imageError,
    imageUrl,
    markAsSaved,
    setImageError,
    uploading,
  } = useImageUploader({
    value,
    onChange,
    folder,
    messages,
  });

  useImperativeHandle(ref, () => ({ markAsSaved }), [markAsSaved]);

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
                alt={messages.previewAlt}
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
                  {messages.uploading}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {messages.uploadButton}
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{messages.helperText}</p>
    </div>
  );
});
