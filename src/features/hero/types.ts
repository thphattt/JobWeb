import type { MediaRef } from '@/lib/payload';

export type HeroContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  slides?: { value?: string; label?: string; image?: MediaRef }[];
};
