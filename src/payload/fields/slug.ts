import type { Field } from 'payload';

/** Tạo slug thân thiện URL từ tiêu đề (bỏ dấu tiếng Việt cơ bản). */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/** Trường slug: tự sinh từ `source` (mặc định 'title') khi để trống. */
export function slugField(source = 'title'): Field {
  return {
    name: 'slug',
    type: 'text',
    unique: true,
    index: true,
    label: 'Đường dẫn (slug)',
    admin: {
      position: 'sidebar',
      description: 'Phần đuôi địa chỉ trang. Cứ để trống — hệ thống tự tạo từ tiêu đề.'
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) =>
          value ||
          (data?.[source] ? slugify(String(data[source])) : value)
      ]
    }
  };
}