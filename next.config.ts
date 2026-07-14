import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Security headers áp cho mọi route. Không đặt Content-Security-Policy đầy đủ
// (dễ vỡ admin Payload) — chỉ dùng frame-ancestors chống clickjacking.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // HSTS: chỉ có tác dụng qua HTTPS (trình duyệt bỏ qua ở localhost/http).
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
];

const nextConfig: NextConfig = {
  // Ẩn "X-Powered-By: Next.js" (đỡ lộ công nghệ cho kẻ tấn công).
  poweredByHeader: false,
  images: {
    // Cho phép tải ảnh từ CMS/cloud sau này (cập nhật domain khi tích hợp Payload).
    remotePatterns: []
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  }
};

export default withPayload(withNextIntl(nextConfig));
