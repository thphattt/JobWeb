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
  slug: 'hero' | 'about' | 'why' | 'contactInfo' | 'brand',
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
  collection: 'services' | 'projects' | 'collaborators',
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
export type ProjectDoc = {
  id: number;
  title: string;
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
