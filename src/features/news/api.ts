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

/** Một trang tin tức (mặc định 6 bài/trang), mới nhất trước — cho trang danh sách. */
export const getNewsPage = (locale: Locale, page = 1, perPage = 6) =>
  safe<{ docs: NewsDoc[]; page: number; totalPages: number; totalDocs: number }>(
    'getNewsPage',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'news',
        locale,
        where: { published: { equals: true } },
        sort: '-date',
        limit: perPage,
        page,
        depth: 1
      });
      return {
        docs: r.docs as NewsDoc[],
        page: r.page ?? page,
        totalPages: r.totalPages ?? 1,
        totalDocs: r.totalDocs ?? r.docs.length
      };
    },
    { docs: [], page: 1, totalPages: 1, totalDocs: 0 }
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
