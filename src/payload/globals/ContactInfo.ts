import type { GlobalConfig } from 'payload';

/** Thông tin liên hệ (văn phòng, điện thoại, email, facebook). */
export const ContactInfo: GlobalConfig = {
  slug: 'contactInfo',
  label: 'Thông tin liên hệ',
  admin: {
    group: 'Thông tin công ty',
    description: 'Địa chỉ văn phòng, điện thoại, email, Facebook — hiển thị ở trang Liên hệ và chân trang.'
  },
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
};
