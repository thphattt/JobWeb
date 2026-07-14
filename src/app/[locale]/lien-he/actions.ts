'use server';

import { headers } from 'next/headers';
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

// ── Chống spam: rate-limit theo IP (in-memory) ────────────────────────────
// Đủ dùng cho 1 tiến trình (VPS). Trên serverless nhiều instance sẽ nới lỏng
// hơn nhưng vẫn có tác dụng, và không phụ thuộc thư viện ngoài.
const RATE_LIMIT = 3; // số lần gửi tối đa
const RATE_WINDOW_MS = 10 * 60 * 1000; // trong 10 phút
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Dọn bớt bộ nhớ khi map phình to.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : h.get('x-real-ip')) || 'unknown';
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: trường ẩn "company" — người thật không thấy nên để trống.
  // Bot điền vào → coi như thành công (không gửi email, không lộ là bị chặn).
  if (String(formData.get('company') ?? '').trim() !== '') {
    return { status: 'success' };
  }

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

  // Giới hạn tần suất theo IP (chống spam làm ngập hộp thư / cạn quota Resend).
  if (rateLimited(await clientIp())) {
    return { status: 'error' };
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
