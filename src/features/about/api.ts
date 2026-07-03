import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { AboutContent } from './types';

export const getAbout = (locale: Locale) =>
  safe<AboutContent | null>(
    'getAbout',
    async () => {
      const p = await payloadClient();
      return (await p.findGlobal({ slug: 'about', locale, depth: 1 })) as AboutContent;
    },
    null
  );
