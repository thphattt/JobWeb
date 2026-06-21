import { routing } from '@/i18n/routing';

/**
 * URL gốc của site, ưu tiên biến môi trường khi deploy.
 * - NEXT_PUBLIC_SITE_URL: đặt thủ công (domain thật).
 * - VERCEL_URL: Vercel tự cấp khi build/preview.
 * - fallback: localhost cho dev.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000'
).replace(/\/$/, '');

/** Tạo bản đồ hreflang cho 1 đường dẫn (vd '' hoặc '/gioi-thieu'). */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `/${loc}${path}`;
  }
  languages['x-default'] = `/${routing.defaultLocale}${path}`;
  return languages;
}