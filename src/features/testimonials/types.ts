import type { MediaRef } from '@/lib/payload';

export type TestimonialDoc = {
  id: number;
  quote: string;
  author: string;
  role?: string;
  photo?: MediaRef;
};

export type ClientDoc = {
  id: number;
  name: string;
  logo?: MediaRef;
};
