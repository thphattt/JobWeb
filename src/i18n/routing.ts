import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Các ngôn ngữ hỗ trợ
  locales: ['vi', 'en'],
  // Ngôn ngữ mặc định
  defaultLocale: 'vi'
});

export type Locale = (typeof routing.locales)[number];
