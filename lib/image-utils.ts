import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Optimizes an uploaded image file client-side using HTML5 canvas.
 * Resizes large images (e.g. 4000px phone captures) down to 1200px max width/height
 * and compresses to high-quality JPEG (~50KB-120KB) so it saves seamlessly
 * into local storage and database without exceeding memory or quota limits.
 */
export async function optimizeBannerImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Calculate aspect ratio preserving dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxWidth) {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);

          // If Supabase Storage is configured, attempt upload to 'tournament-banners' bucket
          if (isSupabaseConfigured && supabase) {
            try {
              const fileExt = file.name.split('.').pop() || 'jpg';
              const fileName = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
              const filePath = `banners/${fileName}`;

              // Convert DataURL to Blob for upload
              const response = await fetch(optimizedDataUrl);
              const blob = await response.blob();

              const { error: uploadError } = await supabase.storage
                .from('tournament-banners')
                .upload(filePath, blob, {
                  contentType: 'image/jpeg',
                  upsert: true,
                });

              if (!uploadError) {
                const { data: publicUrlData } = supabase.storage
                  .from('tournament-banners')
                  .getPublicUrl(filePath);

                if (publicUrlData?.publicUrl) {
                  resolve(publicUrlData.publicUrl);
                  return;
                }
              }
            } catch (err) {
              console.warn('Supabase storage upload fallback to optimized DataURL:', err);
            }
          }

          resolve(optimizedDataUrl);
        } catch (err) {
          console.warn('Image optimization error, falling back to raw data URL', err);
          resolve(event.target?.result as string);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image file'));
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
