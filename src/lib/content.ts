import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Locale } from '@/i18n/routing';

/**
 * Lớp đọc nội dung từ Payload CMS (Local API) cho các Server Component.
 * Mọi hàm đều "an toàn": nếu CMS lỗi/chưa có dữ liệu → trả null/[] để trang
 * tự fallback về chuỗi trong messages (next-intl). Nhờ vậy site không bao giờ
 * vỡ khi DB chưa seed hoặc tạm gián đoạn.
 */

let cached: ReturnType<typeof getPayload> | null = null;
function client() {
  return (cached ??= getPayload({ config }));
}

async function safeGlobal<T = Record<string, unknown>>(
  slug: 'hero' | 'about' | 'why' | 'contactInfo' | 'brand' | 'stats',
  locale: Locale
): Promise<T | null> {
  try {
    const payload = await client();
    return (await payload.findGlobal({ slug, locale, depth: 1 })) as T;
  } catch (err) {
    console.error(`[content] findGlobal(${slug}) failed:`, err);
    return null;
  }
}

async function safeFind<T = Record<string, unknown>>(
  collection:
    | 'services'
    | 'projects'
    | 'collaborators'
    | 'testimonials'
    | 'clients',
  locale: Locale
): Promise<T[]> {
  try {
    const payload = await client();
    const res = await payload.find({
      collection,
      locale,
      sort: 'order',
      limit: 100,
      depth: 1
    });
    return res.docs as T[];
  } catch (err) {
    console.error(`[content] find(${collection}) failed:`, err);
    return [];
  }
}

// ── Kiểu dữ liệu trả về ────────────────────────────────────────────────────
export type HeroContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  slides?: { value?: string; label?: string; image?: MediaRef }[];
};
export type AboutContent = { eyebrow?: string; title?: string; body?: string };
export type WhyContent = {
  eyebrow?: string;
  title?: string;
  items?: { title?: string; description?: string }[];
};
export type ContactContent = {
  offices?: { address?: string }[];
  phones?: { number?: string }[];
  email?: string;
  facebook?: string;
};
export type BrandContent = { name?: string; tagline?: string };
export type ServiceDoc = {
  id: number;
  title: string;
  description?: string;
  icon?: string;
};
export type ProjectRole = 'director' | 'producer';
export type ProjectDoc = {
  id: number;
  title: string;
  role?: ProjectRole;
  year?: string;
  venue?: string;
  image?: { url?: string; alt?: string } | null;
};
export type MediaRef = { url?: string; alt?: string } | null;
export type NewsDoc = {
  id: number;
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  coverImage?: MediaRef;
  // Lexical richtext (kiểu phụ thuộc Payload) — render bằng <RichText/>.
  content?: unknown;
  published?: boolean;
};
export type CollaboratorDoc = {
  id: number;
  name: string;
  role?: string;
  photo?: MediaRef;
};
export type JobDoc = {
  id: number;
  title: string;
  slug: string;
  location?: string;
  type?: 'fulltime' | 'parttime' | 'contract';
  deadline?: string;
  summary?: string;
  description?: unknown;
  published?: boolean;
};
export type TestimonialDoc = {
  id: number;
  quote: string;
  author: string;
  role?: string;
  photo?: MediaRef;
};
export type ClientDoc = {
  id: number;
  name: string;
  logo?: MediaRef;
};
export type StatsContent = {
  eyebrow?: string;
  title?: string;
  items?: { value?: number; suffix?: string; label?: string }[];
};

// ── API công khai ──────────────────────────────────────────────────────────
export const getHero = (l: Locale) => safeGlobal<HeroContent>('hero', l);
export const getAbout = (l: Locale) => safeGlobal<AboutContent>('about', l);
export const getWhy = (l: Locale) => safeGlobal<WhyContent>('why', l);
export const getContact = (l: Locale) =>
  safeGlobal<ContactContent>('contactInfo', l);
export const getBrand = (l: Locale) => safeGlobal<BrandContent>('brand', l);
export const getServices = (l: Locale) => safeFind<ServiceDoc>('services', l);
export const getProjects = (l: Locale) => safeFind<ProjectDoc>('projects', l);
export const getCollaborators = (l: Locale) =>
  safeFind<CollaboratorDoc>('collaborators', l);
export const getTestimonials = (l: Locale) =>
  safeFind<TestimonialDoc>('testimonials', l);
export const getClients = (l: Locale) => safeFind<ClientDoc>('clients', l);
export const getStats = (l: Locale) => safeGlobal<StatsContent>('stats', l);

/** Vị trí tuyển dụng đã xuất bản, mới nhất trước. */
export async function getJobs(locale: Locale): Promise<JobDoc[]> {
  try {
    const payload = await client();
    const res = await payload.find({
      collection: 'jobs',
      locale,
      where: { published: { equals: true } },
      sort: '-createdAt',
      limit: 100,
      depth: 1
    });
    return res.docs as JobDoc[];
  } catch (err) {
    console.error('[content] getJobs failed:', err);
    return [];
  }
}

/** Một vị trí tuyển dụng theo slug (đã xuất bản). */
export async function getJobBySlug(
  slug: string,
  locale: Locale
): Promise<JobDoc | null> {
  try {
    const payload = await client();
    const res = await payload.find({
      collection: 'jobs',
      locale,
      where: { slug: { equals: slug }, published: { equals: true } },
      limit: 1,
      depth: 1
    });
    return (res.docs[0] as JobDoc) ?? null;
  } catch (err) {
    console.error('[content] getJobBySlug failed:', err);
    return null;
  }
}

/** Tin tức đã xuất bản, mới nhất trước. `limit` để lấy số ít cho trang chủ. */
export async function getNews(locale: Locale, limit = 50): Promise<NewsDoc[]> {
  try {
    const payload = await client();
    const res = await payload.find({
      collection: 'news',
      locale,
      where: { published: { equals: true } },
      sort: '-date',
      limit,
      depth: 1
    });
    return res.docs as NewsDoc[];
  } catch (err) {
    console.error('[content] getNews failed:', err);
    return [];
  }
}

/** Một bài tin theo slug (đã xuất bản). Trả null nếu không có. */
export async function getNewsBySlug(
  slug: string,
  locale: Locale
): Promise<NewsDoc | null> {
  try {
    const payload = await client();
    const res = await payload.find({
      collection: 'news',
      locale,
      where: { slug: { equals: slug }, published: { equals: true } },
      limit: 1,
      depth: 1
    });
    return (res.docs[0] as NewsDoc) ?? null;
  } catch (err) {
    console.error('[content] getNewsBySlug failed:', err);
    return null;
  }
}
