/**
 * Upload ảnh trong public/{events,hero,news} vào Media rồi GẮN vào đúng bản ghi:
 *   - projects  → khớp theo `year` (hoặc từ khoá tiêu đề với bản năm trống)
 *   - news      → khớp theo từ khoá trong tiêu đề
 *   - hero.slides → khớp theo `value`
 *
 *   SEED_EMAIL=... SEED_PASSWORD=... node scripts/attach-images.mjs
 *
 * Idempotent: nếu Media đã có file cùng tên thì tái sử dụng, không upload lại.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const BASE = process.env.SEED_BASE || 'http://localhost:3000/api';
const EMAIL = process.env.SEED_EMAIL;
const PASSWORD = process.env.SEED_PASSWORD;
if (!EMAIL || !PASSWORD) {
  console.error('Thiếu SEED_EMAIL / SEED_PASSWORD.');
  process.exit(1);
}

let token = '';
const authJson = () => ({ 'Content-Type': 'application/json', Authorization: `JWT ${token}` });
const pick = (j) => j?.doc ?? j?.result ?? j;

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: authJson(),
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

/** Upload 1 file ảnh vào Media (tái dùng nếu đã tồn tại theo filename). Trả về id. */
async function uploadMedia(relPath, filename, alt) {
  const existing = await req(
    'GET',
    `/media?where[filename][equals]=${encodeURIComponent(filename)}&limit=1&depth=0`
  );
  if (existing.docs?.length) {
    console.log(`  · media đã có: ${filename}`);
    return existing.docs[0].id;
  }
  const buf = await readFile(resolve(process.cwd(), 'public', relPath));
  const fd = new FormData();
  fd.append('file', new Blob([buf], { type: 'image/jpeg' }), filename);
  fd.append('_payload', JSON.stringify({ alt }));
  const res = await fetch(`${BASE}/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` }, // KHÔNG set Content-Type: để fetch tự thêm boundary
    body: fd
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`upload ${filename} → ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  const id = pick(json).id;
  console.log(`  ✓ upload media: ${filename}`);
  return id;
}

async function main() {
  const login = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  }).then((r) => r.json());
  token = login.token;
  if (!token) throw new Error('Đăng nhập thất bại: ' + JSON.stringify(login));
  console.log('Đã đăng nhập. Bắt đầu upload + gắn ảnh…\n');

  // ── PROJECTS ────────────────────────────────────────────────────────────────
  // file → cách khớp project (year, hoặc keyword khi year trống)
  const projectImages = [
    { file: 'events/sea-games-22.jpg', match: (p) => p.year === '2003', alt: 'Bế mạc SEA Games 22' },
    { file: 'events/thang-long-1000.jpg', match: (p) => p.year === '2010', alt: 'Đại lễ 1000 năm Thăng Long' },
    { file: 'events/to-quoc-2015.jpg', match: (p) => p.year === '2015', alt: '“Tôi yêu Tổ quốc tôi” 2015' },
    { file: 'events/den-hung-2019.jpg', match: (p) => p.year === '2019', alt: '“Tôi yêu Tổ quốc tôi” tại Đền Hùng' },
    { file: 'events/thu-do-10.jpg', match: (p) => p.year === '2018', alt: '10 năm mở rộng địa giới Thủ đô' },
    {
      file: 'events/dai-hoi-dang.jpg',
      match: (p) => /Đại hội Đảng/i.test(p.title || ''),
      alt: 'Chào mừng Đại hội Đảng bộ các cấp'
    }
  ];
  const projects = (await req('GET', `/projects?limit=200&depth=0&locale=vi`)).docs || [];
  console.log(`Projects: ${projects.length} bản ghi`);
  for (const img of projectImages) {
    const target = projects.find(img.match);
    if (!target) {
      console.log(`  ⚠ không tìm thấy project cho ${img.file}`);
      continue;
    }
    const mediaId = await uploadMedia(img.file, img.file.split('/').pop(), img.alt);
    await req('PATCH', `/projects/${target.id}?depth=0`, { image: mediaId });
    console.log(`  → gắn ${img.file} vào project "${target.title}"`);
  }

  // ── NEWS ────────────────────────────────────────────────────────────────────
  const newsImages = [
    { file: 'news/news-dai-hoi-dang.jpg', kw: /Đại hội Đảng/i, alt: 'Đồng hành sự kiện Đại hội Đảng' },
    { file: 'news/news-hau-truong.jpg', kw: /Hậu trường/i, alt: 'Hậu trường sản xuất chương trình' },
    { file: 'news/news-tuyen-ctv.jpg', kw: /cộng tác viên/i, alt: 'Tuyển cộng tác viên sự kiện' }
  ];
  const news = (await req('GET', `/news?limit=200&depth=0&locale=vi`)).docs || [];
  console.log(`\nNews: ${news.length} bản ghi`);
  for (const img of newsImages) {
    const target = news.find((n) => img.kw.test(n.title || ''));
    if (!target) {
      console.log(`  ⚠ không tìm thấy bài viết cho ${img.file}`);
      continue;
    }
    const mediaId = await uploadMedia(img.file, img.file.split('/').pop(), img.alt);
    await req('PATCH', `/news/${target.id}?depth=0`, { coverImage: mediaId });
    console.log(`  → gắn ${img.file} vào tin "${target.title.slice(0, 40)}…"`);
  }

  // ── HERO SLIDES ──────────────────────────────────────────────────────────────
  const heroImages = [
    { file: 'hero/hero-2018.jpg', value: '2018', alt: 'Năm thành lập' },
    { file: 'hero/hero-offices.jpg', value: '2', alt: 'Văn phòng tại Hà Nội' },
    { file: 'hero/hero-sea-games.jpg', value: '2003', alt: 'Bế mạc SEA Games 22' },
    { file: 'hero/hero-thang-long.jpg', value: '2010', alt: 'Đại lễ 1000 năm Thăng Long' }
  ];
  const hero = await req('GET', `/globals/hero?locale=vi&depth=0`);
  const slides = hero.slides || [];
  console.log(`\nHero slides: ${slides.length}`);
  const uploaded = {};
  for (const img of heroImages) {
    uploaded[img.value] = await uploadMedia(img.file, img.file.split('/').pop(), img.alt);
  }
  // Ghi lại toàn bộ slides (giữ id + value + label vi), thêm image theo value.
  const newSlides = slides.map((s) => ({
    id: s.id,
    value: s.value,
    label: s.label,
    ...(uploaded[s.value] ? { image: uploaded[s.value] } : {})
  }));
  await req('POST', `/globals/hero?locale=vi&depth=0`, { slides: newSlides });
  for (const img of heroImages) console.log(`  → gắn ${img.file} vào slide value=${img.value}`);

  console.log('\n✅ Hoàn tất. Ảnh đã được upload vào Media và gắn vào các bản ghi.');
}

main().catch((e) => {
  console.error('Lỗi:', e);
  process.exit(1);
});
