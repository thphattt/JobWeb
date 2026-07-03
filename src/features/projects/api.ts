import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { ProjectDoc } from './types';

export const getProjects = (locale: Locale) =>
  safe<ProjectDoc[]>(
    'getProjects',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'projects',
        locale,
        sort: 'order',
        limit: 100,
        depth: 1
      });
      return r.docs as ProjectDoc[];
    },
    []
  );
