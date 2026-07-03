import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { StatsContent } from './types';

export const getStats = (locale: Locale) =>
  safe<StatsContent | null>(
    'getStats',
    async () => {
      const p = await payloadClient();
      return (await p.findGlobal({ slug: 'stats', locale, depth: 1 })) as StatsContent;
    },
    null
  );
