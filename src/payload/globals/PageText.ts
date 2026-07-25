import type { GlobalConfig } from 'payload';

const eyebrow = { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ (eyebrow)' } as const;
const title = { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' } as const;
const lead = { name: 'lead', type: 'textarea', localized: true, label: 'Đoạn dẫn' } as const;

/**
 * Chữ khung của các trang/mục: eyebrow, tiêu đề, đoạn dẫn.
 * Để trống bất kỳ ô nào → website tự dùng chữ mặc định có sẵn trong code.
 */
export const PageText: GlobalConfig = {
  slug: 'page-text',
  label: 'Chữ các trang & mục',
  admin: {
    group: 'Nội dung trang',
    description:
      'Chỉnh eyebrow (dòng nhãn nhỏ), tiêu đề và đoạn dẫn của từng trang/mục. Ô nào để trống sẽ tự dùng chữ mặc định.'
  },
  fields: [
    {
      name: 'projects',
      type: 'group',
      label: 'Mục "Dự án tiêu biểu" (Trang chủ)',
      fields: [
        eyebrow,
        title,
        { name: 'directorTitle', type: 'text', localized: true, label: 'Tiêu đề nhóm Đạo diễn' },
        { name: 'directorLead', type: 'textarea', localized: true, label: 'Mô tả nhóm Đạo diễn' },
        { name: 'producerTitle', type: 'text', localized: true, label: 'Tiêu đề nhóm Nhà sản xuất' },
        { name: 'producerLead', type: 'textarea', localized: true, label: 'Mô tả nhóm Nhà sản xuất' }
      ]
    },
    {
      name: 'about',
      type: 'group',
      label: 'Trang Giới thiệu',
      fields: [eyebrow, title, lead]
    },
    {
      name: 'services',
      type: 'group',
      label: 'Trang Dịch vụ',
      fields: [eyebrow, title, lead]
    },
    {
      name: 'news',
      type: 'group',
      label: 'Trang Tin tức',
      fields: [eyebrow, title, lead]
    },
    {
      name: 'careers',
      type: 'group',
      label: 'Trang Tuyển dụng',
      fields: [eyebrow, title, lead]
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Trang Liên hệ',
      fields: [eyebrow, title, lead]
    }
  ]
};
