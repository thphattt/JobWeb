import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Bỏ qua api, các file nội bộ của Next, và file tĩnh có phần mở rộng
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
