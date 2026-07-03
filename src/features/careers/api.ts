import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { JobDoc } from './types';

/** Vị trí tuyển dụng đã xuất bản, mới nhất trước. */
export const getJobs = (locale: Locale) =>
  safe<JobDoc[]>(
    'getJobs',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'jobs',
        locale,
        where: { published: { equals: true } },
        sort: '-createdAt',
        limit: 100,
        depth: 1
      });
      return r.docs as JobDoc[];
    },
    []
  );

/** Một vị trí tuyển dụng theo slug (đã xuất bản). */
export const getJobBySlug = (slug: string, locale: Locale) =>
  safe<JobDoc | null>(
    'getJobBySlug',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'jobs',
        locale,
        where: { slug: { equals: slug }, published: { equals: true } },
        limit: 1,
        depth: 1
      });
      return (r.docs[0] as JobDoc) ?? null;
    },
    null
  );
