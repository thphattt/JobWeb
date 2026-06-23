import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Bỏ qua api, admin (Payload), các file nội bộ của Next, và file tĩnh có phần mở rộng
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
