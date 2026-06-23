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
  collection: 'services' | 'projects',
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

// ── API công khai ──────────────────────────────────────────────────────────
export const getHero = (l: Locale) => safeGlobal<HeroContent>('hero', l);
export const getAbout = (l: Locale) => safeGlobal<AboutContent>('about', l);
export const getWhy = (l: Locale) => safeGlobal<WhyContent>('why', l);
export const getContact = (l: Locale) =>
  safeGlobal<ContactContent>('contactInfo', l);
export const getBrand = (l: Locale) => safeGlobal<BrandContent>('brand', l);
export const getServices = (l: Locale) => safeFind<ServiceDoc>('services', l);
export const getProjects = (l: Locale) => safeFind<ProjectDoc>('projects', l);
