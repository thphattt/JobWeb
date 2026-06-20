'use server';

import { z } from 'zod';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  fields?: string[];
};

const schema = z.object({
  name: z.string().trim().min(2),
  contact: z.string().trim().min(5),
  message: z.string().trim().min(10)
});

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    contact: formData.get('contact'),
    message: formData.get('message')
  });

  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((i) => String(i.path[0])))
    ];
    return { status: 'error', fields };
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? 'tanchauthanhhn@gmail.com';

  if (apiKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from:
          process.env.CONTACT_FROM_EMAIL ??
          'Tân Châu Thành <onboarding@resend.dev>',
        to,
        subject: `Liên hệ mới từ ${data.name}`,
        text: `Tên: ${data.name}\nLiên hệ: ${data.contact}\n\nNội dung:\n${data.message}`
      });
    } catch (err) {
      console.error('[contact] Resend error:', err);
      return { status: 'error' };
    }
  } else {
    // Chưa cấu hình RESEND_API_KEY — log để dev xem; UX vẫn báo thành công.
    console.log('[contact] (RESEND_API_KEY chưa cấu hình) submission:', data);
  }

  return { status: 'success' };
}