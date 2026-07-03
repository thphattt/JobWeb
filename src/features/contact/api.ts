import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { ContactContent } from './types';

export const getContact = (locale: Locale) =>
  safe<ContactContent | null>(
    'getContact',
    async () => {
      const p = await payloadClient();
      return (await p.findGlobal({
        slug: 'contactInfo',
        locale,
        depth: 1
      })) as ContactContent;
    },
    null
  );
