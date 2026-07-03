import type { CollectionConfig } from 'payload';

/** Người dùng quản trị (đăng nhập /admin). */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', group: 'Hệ thống' },
  fields: [{ name: 'name', type: 'text', label: 'Tên hiển thị' }]
};
