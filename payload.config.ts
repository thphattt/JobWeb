import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/** Tạo slug thân thiện URL từ tiêu đề (giữ chữ cái có dấu → bỏ dấu cơ bản). */
function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default buildConfig({
  // ── Admin user ─────────────────────────────────────────────────────────
  admin: {
    user: 'users'
  },

  // ── Song ngữ: bật bản dịch theo trường (vi mặc định, en tuỳ chọn) ─────────
  localization: {
    locales: [
      { label: 'Tiếng Việt', code: 'vi' },
      { label: 'English', code: 'en' }
    ],
    defaultLocale: 'vi',
    fallback: true
  },

  // ── Trình soạn rich text ─────────────────────────────────────────────────
  editor: lexicalEditor(),

  // ── Kết nối Neon Postgres ────────────────────────────────────────────────
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Dev: tự đồng bộ schema từ collections/globals. Khi deploy nên dùng migrations.
    push: true
  }),

  secret: process.env.PAYLOAD_SECRET || '',
  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts')
  },

  // ── Collections ──────────────────────────────────────────────────────────
  collections: [
    // Người dùng quản trị (đăng nhập /admin)
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email', group: 'Hệ thống' },
      fields: [{ name: 'name', type: 'text', label: 'Tên hiển thị' }]
    },

    // Thư viện ảnh (hero, sự kiện, …)
    {
      slug: 'media',
      admin: { group: 'Hệ thống' },
      upload: {
        staticDir: path.resolve(dirname, 'public/uploads'),
        mimeTypes: ['image/*']
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Mô tả ảnh (alt)',
          localized: true
        }
      ]
    },

    // Dịch vụ
    {
      slug: 'services',
      labels: { singular: 'Dịch vụ', plural: 'Dịch vụ' },
      admin: { useAsTitle: 'title', defaultColumns: ['title', 'order'], group: 'Nội dung' },
      orderable: true,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: 'Tên dịch vụ' },
        { name: 'description', type: 'textarea', localized: true, label: 'Mô tả' },
        {
          name: 'icon',
          type: 'select',
          label: 'Biểu tượng',
          defaultValue: 'clapperboard',
          options: [
            { label: 'Đạo diễn / Kịch bản', value: 'clapperboard' },
            { label: 'Tổ chức sản xuất', value: 'layers' },
            { label: 'Nhân sự sự kiện', value: 'users' },
            { label: 'Thiết bị sự kiện', value: 'speaker' }
          ]
        },
        { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
      ]
    },

    // Dự án / Sự kiện tiêu biểu
    {
      slug: 'projects',
      labels: { singular: 'Dự án', plural: 'Dự án tiêu biểu' },
      admin: { useAsTitle: 'title', defaultColumns: ['title', 'year', 'order'], group: 'Nội dung' },
      orderable: true,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: 'Tên chương trình' },
        {
          name: 'role',
          type: 'select',
          label: 'Vai trò',
          defaultValue: 'director',
          options: [
            { label: 'Đạo diễn (thành viên Tân Châu Thành)', value: 'director' },
            { label: 'Nhà sản xuất (Công ty Tân Châu Thành)', value: 'producer' }
          ]
        },
        { name: 'year', type: 'text', label: 'Năm' },
        { name: 'venue', type: 'text', localized: true, label: 'Địa điểm / mô tả ngắn' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh (tuỳ chọn)' },
        { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
      ]
    },

    // Tin tức
    {
      slug: 'news',
      labels: { singular: 'Tin tức', plural: 'Tin tức' },
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'date', 'published'],
        group: 'Nội dung'
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: 'Tiêu đề' },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          index: true,
          label: 'Đường dẫn (slug)',
          admin: { description: 'Để trống sẽ tự tạo từ tiêu đề.' },
          hooks: {
            beforeValidate: [
              ({ value, data }) =>
                value || (data?.title ? slugify(String(data.title)) : value)
            ]
          }
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          label: 'Ngày đăng',
          admin: { date: { pickerAppearance: 'dayOnly' } }
        },
        { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Ảnh bìa' },
        { name: 'excerpt', type: 'textarea', localized: true, label: 'Tóm tắt' },
        { name: 'content', type: 'richText', localized: true, label: 'Nội dung' },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: true,
          label: 'Hiển thị trên website'
        }
      ]
    },

    // Gương mặt hợp tác tiêu biểu
    {
      slug: 'collaborators',
      labels: { singular: 'Gương mặt hợp tác', plural: 'Gương mặt hợp tác tiêu biểu' },
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'role', 'order'],
        group: 'Nội dung'
      },
      orderable: true,
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Tên' },
        { name: 'role', type: 'text', localized: true, label: 'Vai trò / danh hiệu' },
        { name: 'photo', type: 'upload', relationTo: 'media', label: 'Ảnh chân dung' },
        { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
      ]
    },

    // Tuyển dụng
    {
      slug: 'jobs',
      labels: { singular: 'Vị trí tuyển dụng', plural: 'Tuyển dụng' },
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'location', 'deadline', 'published'],
        group: 'Nội dung'
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: 'Chức danh' },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          index: true,
          label: 'Đường dẫn (slug)',
          admin: { description: 'Để trống sẽ tự tạo từ chức danh.' },
          hooks: {
            beforeValidate: [
              ({ value, data }) =>
                value || (data?.title ? slugify(String(data.title)) : value)
            ]
          }
        },
        { name: 'location', type: 'text', localized: true, label: 'Địa điểm' },
        {
          name: 'type',
          type: 'select',
          label: 'Hình thức',
          defaultValue: 'fulltime',
          options: [
            { label: 'Toàn thời gian', value: 'fulltime' },
            { label: 'Bán thời gian', value: 'parttime' },
            { label: 'Cộng tác viên', value: 'contract' }
          ]
        },
        {
          name: 'deadline',
          type: 'date',
          label: 'Hạn nộp hồ sơ',
          admin: { date: { pickerAppearance: 'dayOnly' } }
        },
        { name: 'summary', type: 'textarea', localized: true, label: 'Tóm tắt' },
        { name: 'description', type: 'richText', localized: true, label: 'Mô tả công việc' },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: true,
          label: 'Hiển thị trên website'
        }
      ]
    },

    // Cảm nhận khách hàng
    {
      slug: 'testimonials',
      labels: { singular: 'Cảm nhận', plural: 'Cảm nhận khách hàng' },
      admin: {
        useAsTitle: 'author',
        defaultColumns: ['author', 'role', 'order'],
        group: 'Nội dung'
      },
      orderable: true,
      fields: [
        { name: 'quote', type: 'textarea', required: true, localized: true, label: 'Nội dung cảm nhận' },
        { name: 'author', type: 'text', required: true, label: 'Tên người nhận xét' },
        { name: 'role', type: 'text', localized: true, label: 'Chức vụ / đơn vị' },
        { name: 'photo', type: 'upload', relationTo: 'media', label: 'Ảnh (tuỳ chọn)' },
        { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
      ]
    },

    // Khách hàng & Đối tác
    {
      slug: 'clients',
      labels: { singular: 'Khách hàng', plural: 'Khách hàng & Đối tác' },
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'order'],
        group: 'Nội dung'
      },
      orderable: true,
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Tên khách hàng / đối tác' },
        { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo (tuỳ chọn)' },
        { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
      ]
    }
  ],

  // ── Globals (nội dung đơn) ────────────────────────────────────────────────
  globals: [
    // Hero
    {
      slug: 'hero',
      label: 'Trang chủ — Hero',
      admin: { group: 'Nội dung' },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ' },
        { name: 'title', type: 'text', localized: true, label: 'Tiêu đề lớn' },
        { name: 'subtitle', type: 'textarea', localized: true, label: 'Mô tả' },
        { name: 'ctaPrimary', type: 'text', localized: true, label: 'Nút chính' },
        { name: 'ctaSecondary', type: 'text', localized: true, label: 'Nút phụ' },
        {
          name: 'slides',
          type: 'array',
          label: 'Slide carousel (khối bên phải)',
          labels: { singular: 'Slide', plural: 'Slide' },
          fields: [
            { name: 'value', type: 'text', label: 'Số/Chữ lớn (vd 2018)' },
            { name: 'label', type: 'text', localized: true, label: 'Nhãn dưới' },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Ảnh nền (tuỳ chọn)'
            }
          ]
        }
      ]
    },

    // Về chúng tôi
    {
      slug: 'about',
      label: 'Trang chủ — Về chúng tôi',
      admin: { group: 'Nội dung' },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ' },
        { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' },
        { name: 'body', type: 'textarea', localized: true, label: 'Nội dung' }
      ]
    },

    // Vì sao chọn — 4 thế mạnh
    {
      slug: 'why',
      label: 'Trang chủ — Vì sao chọn',
      admin: { group: 'Nội dung' },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ' },
        { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' },
        {
          name: 'items',
          type: 'array',
          label: 'Thế mạnh',
          maxRows: 4,
          fields: [
            { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' },
            { name: 'description', type: 'textarea', localized: true, label: 'Mô tả' }
          ]
        }
      ]
    },

    // Thông tin liên hệ
    {
      slug: 'contactInfo',
      label: 'Thông tin liên hệ',
      admin: { group: 'Nội dung' },
      fields: [
        {
          name: 'offices',
          type: 'array',
          label: 'Văn phòng',
          fields: [{ name: 'address', type: 'text', localized: true, label: 'Địa chỉ' }]
        },
        {
          name: 'phones',
          type: 'array',
          label: 'Điện thoại',
          fields: [{ name: 'number', type: 'text', label: 'Số' }]
        },
        { name: 'email', type: 'text', label: 'Email' },
        { name: 'facebook', type: 'text', label: 'Facebook URL' }
      ]
    },

    // Thương hiệu
    {
      slug: 'brand',
      label: 'Thương hiệu',
      admin: { group: 'Nội dung' },
      fields: [
        { name: 'name', type: 'text', localized: true, label: 'Tên công ty' },
        { name: 'tagline', type: 'text', localized: true, label: 'Khẩu hiệu' }
      ]
    },

    // Số liệu nổi bật (trang chủ)
    {
      slug: 'stats',
      label: 'Trang chủ — Số liệu nổi bật',
      admin: { group: 'Nội dung' },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ' },
        { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' },
        {
          name: 'items',
          type: 'array',
          label: 'Số liệu',
          maxRows: 4,
          fields: [
            { name: 'value', type: 'number', label: 'Giá trị (số)' },
            { name: 'suffix', type: 'text', label: 'Hậu tố (vd + hoặc K)' },
            { name: 'label', type: 'text', localized: true, label: 'Nhãn' }
          ]
        }
      ]
    }
  ]
});
