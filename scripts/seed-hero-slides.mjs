/**
 * Seed mảng "slides" cho global Hero (carousel khối phải trang chủ), song ngữ.
 * Chỉ cập nhật trường slides (giữ nguyên eyebrow/title/subtitle/cta).
 *   SEED_EMAIL=... SEED_PASSWORD=... node scripts/seed-hero-slides.mjs
 */
const BASE = process.env.SEED_BASE || 'http://localhost:3000/api';
const EMAIL = process.env.SEED_EMAIL;
const PASSWORD = process.env.SEED_PASSWORD;
if (!EMAIL || !PASSWORD) {
  console.error('Thiếu SEED_EMAIL / SEED_PASSWORD.');
  process.exit(1);
}

let token = '';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `JWT ${token}` });
const pick = (j) => j?.doc ?? j?.result ?? j;

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: H(),
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
  return json;
}

async function main() {
  const login = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  }).then((r) => r.json());
  token = login.token;
  if (!token) throw new Error('Đăng nhập thất bại: ' + JSON.stringify(login));

  const slides = [
    { value: '2018', vi: 'Năm thành lập', en: 'Established' },
    { value: '2', vi: 'Văn phòng tại Hà Nội', en: 'Offices in Hanoi' },
    {
      value: '2003',
      vi: 'Bế mạc SEA Games 22',
      en: 'SEA Games 22 closing ceremony'
    },
    {
      value: '2010',
      vi: 'Đại lễ 1000 năm Thăng Long – Hà Nội',
      en: '1000th Anniversary of Thang Long – Hanoi'
    }
  ];

  // vi: tạo các slide (value không localized, label = vi)
  const viDoc = pick(
    await req('POST', `/globals/hero?locale=vi&depth=0`, {
      slides: slides.map((s) => ({ value: s.value, label: s.vi }))
    })
  );

  // en: ghép id từng dòng để localize label
  await req('POST', `/globals/hero?locale=en&depth=0`, {
    slides: (viDoc.slides || []).map((row, i) => ({
      id: row.id,
      value: slides[i].value,
      label: slides[i].en
    }))
  });

  console.log(`Seed hero slides (${slides.length}) hoàn tất.`);
}

main().catch((e) => {
  console.error('Seed lỗi:', e);
  process.exit(1);
});
