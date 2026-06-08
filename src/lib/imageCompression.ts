/**
 * Utility function to compress images on the client side using HTML5 Canvas
 * @param file The original image file
 * @param maxWidth The maximum width of the compressed image
 * @param quality The quality of the compressed JPEG (0.0 to 1.0)
 * @returns Promise that resolves to a base64 encoded string of the compressed image
 */
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions keeping aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to base64 JPEG
        const base64String = canvas.toDataURL('image/jpeg', quality);
        resolve(base64String);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
