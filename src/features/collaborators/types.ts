import type { MediaRef } from '@/lib/payload';

export type CollaboratorDoc = {
  id: number;
  name: string;
  role?: string;
  photo?: MediaRef;
};
