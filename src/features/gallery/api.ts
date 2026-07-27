import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { GalleryImageDoc } from './types';

export const getGalleryImages = (locale: Locale) =>
  safe<GalleryImageDoc[]>(
    'getGalleryImages',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'gallery-images',
        locale,
        sort: 'order',
        limit: 200,
        depth: 1
      });
      return r.docs as GalleryImageDoc[];
    },
    []
  );
