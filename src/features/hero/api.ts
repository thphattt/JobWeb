import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { HeroContent } from './types';

export const getHero = (locale: Locale) =>
  safe<HeroContent | null>(
    'getHero',
    async () => {
      const p = await payloadClient();
      return (await p.findGlobal({ slug: 'hero', locale, depth: 1 })) as HeroContent;
    },
    null
  );
