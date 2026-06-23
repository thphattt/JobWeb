import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // Cho phép tải ảnh từ CMS/cloud sau này (cập nhật domain khi tích hợp Payload).
    remotePatterns: []
  }
};

export default withPayload(withNextIntl(nextConfig));
