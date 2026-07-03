import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { BrandContent } from './types';

export const getBrand = (locale: Locale) =>
  safe<BrandContent | null>(
    'getBrand',
    async () => {
      const p = await payloadClient();
      return (await p.findGlobal({ slug: 'brand', locale, depth: 1 })) as BrandContent;
    },
    null
  );
