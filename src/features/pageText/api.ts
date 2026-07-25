import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { PageTextContent } from './types';

/** Chữ khung (eyebrow/tiêu đề/đoạn dẫn) của các trang & mục. */
export const getPageText = (locale: Locale) =>
  safe<PageTextContent | null>(
    'getPageText',
    async () => {
      const p = await payloadClient();
      return (await p.findGlobal({
        slug: 'page-text',
        locale,
        depth: 0
      })) as PageTextContent;
    },
    null
  );
