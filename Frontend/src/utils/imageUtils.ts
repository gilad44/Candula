/**
 * Image processing utilities for candle upload
 */

/**
 * Converts a File object to base64 string
 */
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const base64Content = base64.split(",")[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a blob URL for displaying images
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Validates image file type and size
 */
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Please select a valid image file (JPEG, PNG, or WebP)",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "Image size must be less than 10MB",
    };
  }

  return { isValid: true };
};
