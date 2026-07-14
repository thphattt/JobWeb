import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { resendAdapter } from '@payloadcms/email-resend';
import { vi } from '@payloadcms/translations/languages/vi';
import { en } from '@payloadcms/translations/languages/en';
import sharp from 'sharp';

import { Users } from './src/payload/collections/Users';
import { Media } from './src/payload/collections/Media';
import { Services } from './src/payload/collections/Services';
import { Projects } from './src/payload/collections/Projects';
import { News } from './src/payload/collections/News';
import { Collaborators } from './src/payload/collections/Collaborators';
import { Jobs } from './src/payload/collections/Jobs';
import { Testimonials } from './src/payload/collections/Testimonials';
import { Clients } from './src/payload/collections/Clients';

import { Hero } from './src/payload/globals/Hero';
import { About } from './src/payload/globals/About';
import { Why } from './src/payload/globals/Why';
import { ContactInfo } from './src/payload/globals/ContactInfo';
import { Brand } from './src/payload/globals/Brand';
import { Stats } from './src/payload/globals/Stats';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
    // Thương hiệu trang quản trị (thẻ trình duyệt, trang đăng nhập).
    meta: {
      title: 'Quản trị nội dung',
      titleSuffix: ' · Tân Châu Thành',
      description: 'Trang quản trị nội dung website Tân Châu Thành'
    }
  },

  // Giao diện trang quản trị hiển thị Tiếng Việt (nút bấm, menu, cột, lịch…).
  i18n: {
    fallbackLanguage: 'vi',
    supportedLanguages: { vi, en }
  },

  // Song ngữ nội dung: bật bản dịch theo trường (vi mặc định, en tuỳ chọn).
  localization: {
    locales: [
      { label: 'Tiếng Việt', code: 'vi' },
      { label: 'English', code: 'en' }
    ],
    defaultLocale: 'vi',
    fallback: true
  },

  editor: lexicalEditor(),

  // Bảo mật GraphQL: ẩn Playground + introspection ở production (giảm lộ schema).
  graphQL: {
    disablePlaygroundInProduction: true,
    disableIntrospectionInProduction: true
  },

  // Email hệ thống (khôi phục mật khẩu admin, thông báo…) gửi qua Resend.
  // Dùng chung RESEND_API_KEY với form liên hệ. Thiếu key → Payload log ra console.
  email: resendAdapter({
    defaultFromName: 'Tân Châu Thành',
    defaultFromAddress: process.env.CONTACT_FROM_ADDRESS || 'onboarding@resend.dev',
    apiKey: process.env.RESEND_API_KEY || ''
  }),

  // Neon Postgres.
  // - Dev: push:true tự đồng bộ schema cho nhanh.
  // - Production: push:false + chạy migrations (an toàn, không tự sửa DB thật).
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'src/migrations')
  }),

  secret: process.env.PAYLOAD_SECRET || '',
  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts')
  },

  // Thứ tự trong mảng = thứ tự hiển thị trong từng nhóm ở menu bên trái.
  collections: [
    // Nhóm "Nội dung" — nơi khách thêm/sửa hằng ngày
    News,
    Projects,
    Services,
    Jobs,
    Collaborators,
    Testimonials,
    Clients,
    // Nhóm "Hệ thống"
    Media,
    Users
  ],

  globals: [
    // Nhóm "Trang chủ"
    Hero,
    Stats,
    About,
    Why,
    // Nhóm "Thông tin công ty"
    Brand,
    ContactInfo
  ]
});
