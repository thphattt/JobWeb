import type { MediaRef } from '@/lib/payload';

export type ProjectRole = 'director' | 'producer';

export type ProjectDoc = {
  id: number;
  title: string;
  role?: ProjectRole;
  year?: string;
  venue?: string;
  image?: MediaRef;
};
