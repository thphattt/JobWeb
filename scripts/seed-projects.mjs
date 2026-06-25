/**
 * Seed lại collection "projects" với 2 nhóm vai trò (Đạo diễn / Nhà sản xuất),
 * mỗi nhóm 4 sự kiện. Chỉ đụng tới `projects` (không ghi đè nội dung khác).
 *   SEED_EMAIL=... SEED_PASSWORD=... node scripts/seed-projects.mjs
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

  // Xoá sạch projects cũ
  const list = await req('GET', `/projects?limit=200&depth=0`);
  for (const d of list.docs || []) await req('DELETE', `/projects/${d.id}`);

  const data = [
    // ── Vai trò Đạo diễn ────────────────────────────────────────────────────
    {
      role: 'director',
      year: '2003',
      vi: { title: 'Bế mạc SEA Games 22', venue: 'SVĐ Mỹ Đình, Hà Nội' },
      en: { title: 'SEA Games 22 closing ceremony', venue: 'My Dinh Stadium, Hanoi' }
    },
    {
      role: 'director',
      year: '2010',
      vi: {
        title: 'Đại lễ 1000 năm Thăng Long – Hà Nội',
        venue: 'Sân khấu số 5 “Thành phố vì hòa bình”'
      },
      en: {
        title: '1000th Anniversary of Thang Long – Hanoi',
        venue: 'Stage No. 5 “City for Peace”'
      }
    },
    {
      role: 'director',
      year: '2015',
      vi: {
        title: '“Tôi yêu Tổ quốc tôi”',
        venue: 'Quảng trường Mỹ Đình — màn xếp hình 10.000 đoàn viên'
      },
      en: {
        title: '“I love my Fatherland”',
        venue: 'My Dinh Square — a 10,000-member card stunt'
      }
    },
    {
      role: 'director',
      year: '2019',
      vi: { title: '“Tôi yêu Tổ quốc tôi” tại Đền Hùng', venue: 'TW Hội LHTN Việt Nam' },
      en: { title: '“I love my Fatherland” at Hung Temple', venue: 'Vietnam Youth Federation' }
    },

    // ── Vai trò Nhà sản xuất ────────────────────────────────────────────────
    {
      role: 'producer',
      year: '2018',
      vi: {
        title: 'Kỷ niệm 10 năm mở rộng địa giới hành chính Thủ đô',
        venue: 'Hà Nội'
      },
      en: {
        title: "10th anniversary of Hanoi's administrative expansion",
        venue: 'Hanoi'
      }
    },
    {
      role: 'producer',
      year: '',
      vi: {
        title: 'Chào mừng Đại hội Đảng bộ các cấp',
        venue: 'Hướng tới Đại hội Đảng toàn quốc lần thứ XIV'
      },
      en: {
        title: 'Welcoming Party congresses',
        venue: 'Toward the 14th National Party Congress'
      }
    },
    {
      role: 'producer',
      year: '2023',
      vi: {
        title: 'Chương trình nghệ thuật chào mừng (mẫu — hãy sửa)',
        venue: 'Hà Nội'
      },
      en: { title: 'Welcome art program (sample — please edit)', venue: 'Hanoi' }
    },
    {
      role: 'producer',
      year: '2022',
      vi: {
        title: 'Lễ kỷ niệm & gala doanh nghiệp (mẫu — hãy sửa)',
        venue: 'Hà Nội'
      },
      en: { title: 'Anniversary & corporate gala (sample — please edit)', venue: 'Hanoi' }
    }
  ];

  let order = 0;
  for (const p of data) {
    const created = pick(
      await req('POST', `/projects?locale=vi&depth=0`, {
        title: p.vi.title,
        venue: p.vi.venue,
        role: p.role,
        year: p.year,
        order: order++
      })
    );
    await req('PATCH', `/projects/${created.id}?locale=en&depth=0`, {
      title: p.en.title,
      venue: p.en.venue
    });
    console.log(`  ✓ [${p.role}] ${p.vi.title}`);
  }
  console.log('Seed projects (2 nhóm × 4) hoàn tất.');
}

main().catch((e) => {
  console.error('Seed lỗi:', e);
  process.exit(1);
});
