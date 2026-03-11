/**
 * Cloudinary utilities
 * Handles URL parsing and publicId extraction
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_URL_PATTERN =
  /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(.+)/;

/**
 * Extracts publicId from Cloudinary URL
 * @example
 * extractPublicId('https://res.cloudinary.com/demo/image/upload/temp_files/abc.jpg')
 * // Returns: 'temp_files/abc.jpg'
 */
export function extractPublicIdFromUrl(url: string): string | null {
  const match = url.match(CLOUDINARY_URL_PATTERN);
  if (!match) return null;

  // Remove version and transformations, keep only publicId
  const path = match[1];
  const parts = path.split('/');

  // Remove version prefix (v1234567890)
  const withoutVersion = parts.filter(
    (part) => !part.startsWith('v') || isNaN(Number(part.substring(1))),
  );

  const publicIdWithExt = withoutVersion.join('/');
  const lastDotIndex = publicIdWithExt.lastIndexOf('.');

  return lastDotIndex !== -1
    ? publicIdWithExt.substring(0, lastDotIndex)
    : publicIdWithExt;
}

/**
 * Checks if a string is a Cloudinary URL
 */
export function isCloudinaryUrl(value?: string): boolean {
  if (!value) return false;
  return CLOUDINARY_URL_PATTERN.test(value);
}

/**
 * Checks if value is a full HTTP(S) URL
 */
export function isHttpUrl(value?: string): boolean {
  if (!value) return false;
  return value.startsWith('http://') || value.startsWith('https://');
}

/**
 * Resolves a value to a Cloudinary URL
 * - If it's already a full URL, returns it
 * - If it's a publicId, constructs the URL
 */
export function resolveCloudinaryUrl(value?: string): string | undefined {
  if (!value) return undefined;
  if (isHttpUrl(value)) return value;
  if (!CLOUDINARY_CLOUD_NAME) return undefined;

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${value}`;
}

/**
 * Prepares imageUrl for server submission
 * - If it's a Cloudinary temp_files URL, extracts and returns the publicId
 * - If it's a temp_files publicId, returns it as-is
 * - Otherwise returns undefined (keeps existing image on server)
 */
export function prepareImageUrlForServer(
  imageUrl?: string,
): string | undefined {
  if (imageUrl === '') return '';
  if (!imageUrl) return undefined;

  const normalizeTempPublicId = (value: string): string => {
    const duplicatePrefix = 'temp_files/temp_files/';
    const normalized = value.startsWith(duplicatePrefix)
      ? `temp_files/${value.substring(duplicatePrefix.length)}`
      : value;

    const lastDotIndex = normalized.lastIndexOf('.');
    return lastDotIndex !== -1
      ? normalized.substring(0, lastDotIndex)
      : normalized;
  };

  // If it's already a publicId with temp_files/, send it
  if (imageUrl.startsWith('temp_files/')) {
    return normalizeTempPublicId(imageUrl);
  }

  // If it's a Cloudinary URL with temp_files, extract the publicId
  if (isCloudinaryUrl(imageUrl)) {
    const publicId = extractPublicIdFromUrl(imageUrl);

    // Only send if it's a temp file (new upload)
    if (publicId?.startsWith('temp_files/')) {
      return normalizeTempPublicId(publicId);
    }
  }

  // For existing images (full URLs without temp_files), don't send
  // This prevents unnecessary updates when user didn't change the image
  return undefined;
}
