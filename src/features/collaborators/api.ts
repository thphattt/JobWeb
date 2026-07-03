import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { CollaboratorDoc } from './types';

export const getCollaborators = (locale: Locale) =>
  safe<CollaboratorDoc[]>(
    'getCollaborators',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'collaborators',
        locale,
        sort: 'order',
        limit: 100,
        depth: 1
      });
      return r.docs as CollaboratorDoc[];
    },
    []
  );
