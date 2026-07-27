import type { MediaRef } from '@/lib/payload';

export type GalleryImageDoc = {
  id: number;
  image?: MediaRef;
  caption?: string;
};
