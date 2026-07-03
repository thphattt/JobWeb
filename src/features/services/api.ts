import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { ServiceDoc } from './types';

export const getServices = (locale: Locale) =>
  safe<ServiceDoc[]>(
    'getServices',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'services',
        locale,
        sort: 'order',
        limit: 100,
        depth: 1
      });
      return r.docs as ServiceDoc[];
    },
    []
  );
