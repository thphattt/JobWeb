import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { NewsDoc } from './types';

/** Tin tức đã xuất bản, mới nhất trước. `limit` để lấy số ít cho trang chủ. */
export const getNews = (locale: Locale, limit = 50) =>
  safe<NewsDoc[]>(
    'getNews',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'news',
        locale,
        where: { published: { equals: true } },
        sort: '-date',
        limit,
        depth: 1
      });
      return r.docs as NewsDoc[];
    },
    []
  );

/** Một bài tin theo slug (đã xuất bản). Trả null nếu không có. */
export const getNewsBySlug = (slug: string, locale: Locale) =>
  safe<NewsDoc | null>(
    'getNewsBySlug',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'news',
        locale,
        where: { slug: { equals: slug }, published: { equals: true } },
        limit: 1,
        depth: 1
      });
      return (r.docs[0] as NewsDoc) ?? null;
    },
    null
  );
