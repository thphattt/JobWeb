import type { MediaRef } from '@/lib/payload';

export type NewsDoc = {
  id: number;
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  coverImage?: MediaRef;
  /** Lexical richtext — render bằng <RichText/>. */
  content?: unknown;
  published?: boolean;
};

/** Dữ liệu tối thiểu để render thẻ tin (an toàn truyền qua client/carousel). */
export type NewsCardPost = {
  id: number;
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  coverImage?: MediaRef;
};
