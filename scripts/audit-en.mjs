/**
 * Kiểm kê các ô SONG NGỮ đang TRỐNG tiếng Anh (đang fallback về tiếng Việt).
 * In ra chữ tiếng Việt để dịch, kèm slug/id để nhập lại sau.
 *
 *   SEED_EMAIL=admin@... SEED_PASSWORD=... node scripts/audit-en.mjs
 * (chạy trên VPS, nơi app đang chạy ở cổng 3000)
 */
const BASE = process.env.AUDIT_BASE || process.env.SEED_BASE || 'http://localhost:3000/api';
const EMAIL = process.env.SEED_EMAIL || process.env.ADMIN_EMAIL;
const PASSWORD = process.env.SEED_PASSWORD || process.env.ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('Thiếu SEED_EMAIL / SEED_PASSWORD (tài khoản admin).');
  process.exit(1);
}

// Field song ngữ theo cấu hình collections/globals.
const GLOBALS = {
  hero: { fields: ['eyebrow', 'title', 'subtitle', 'ctaPrimary', 'ctaSecondary'], arrays: { slides: ['label'] } },
  stats: { fields: ['eyebrow', 'title'], arrays: { items: ['label'] } },
  why: { fields: ['eyebrow', 'title'], arrays: { items: ['title', 'description'] } },
  contactInfo: { fields: [], arrays: { offices: ['address'] } },
  brand: { fields: ['name', 'tagline'], arrays: {} }
};
const COLLECTIONS = {
  services: { fields: ['title', 'description'], rich: [] },
  projects: { fields: ['title', 'venue'], rich: [] },
  news: { fields: ['title', 'excerpt'], rich: ['content'] },
  collaborators: { fields: ['role'], rich: [] },
  jobs: { fields: ['title', 'location', 'summary'], rich: ['description'] },
  testimonials: { fields: ['quote', 'role'], rich: [] }
};

let token = '';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `JWT ${token}` });

async function get(path) {
  const res = await fetch(BASE + path, { headers: H() });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const empty = (v) => v == null || (typeof v === 'string' && v.trim() === '');

function lexText(node) {
  if (!node) return '';
  if (typeof node.text === 'string') return node.text;
  const kids = node.children || (node.root && node.root.children) || [];
  return kids.map(lexText).join(node.type === 'paragraph' ? '\n' : '');
}

const report = [];
const add = (loc, field, vi, rich = false) => {
  if (empty(vi)) return;
  report.push({ loc, field, rich, vi: rich ? lexText(vi.root ? vi : { root: vi }) : vi });
};

async function main() {
  const login = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  }).then((r) => r.json());
  token = login.token;
  if (!token) throw new Error('Đăng nhập thất bại: ' + JSON.stringify(login).slice(0, 200));

  // ── Globals ──────────────────────────────────────────────────────────────
  for (const [slug, cfg] of Object.entries(GLOBALS)) {
    const vi = await get(`/globals/${slug}?locale=vi&depth=0`);
    const en = await get(`/globals/${slug}?locale=en&fallback-locale=none&depth=0`);
    for (const f of cfg.fields) if (empty(en[f])) add(`${slug}`, f, vi[f]);
    for (const [arr, afields] of Object.entries(cfg.arrays || {})) {
      const viArr = vi[arr] || [];
      const enArr = en[arr] || [];
      viArr.forEach((row, i) => {
        for (const f of afields) if (empty((enArr[i] || {})[f])) add(`${slug}.${arr}[${i}]`, f, row[f]);
      });
    }
  }

  // ── Collections ──────────────────────────────────────────────────────────
  for (const [slug, cfg] of Object.entries(COLLECTIONS)) {
    const viList = await get(`/${slug}?limit=500&depth=0&locale=vi`);
    const enList = await get(`/${slug}?limit=500&depth=0&locale=en&fallback-locale=none`);
    const enById = new Map((enList.docs || []).map((d) => [d.id, d]));
    for (const v of viList.docs || []) {
      const e = enById.get(v.id) || {};
      for (const f of cfg.fields) if (empty(e[f])) add(`${slug}#${v.id}`, f, v[f]);
      for (const f of cfg.rich) if (empty(e[f])) add(`${slug}#${v.id}`, f, v[f], true);
    }
  }

  // ── In kết quả ─────────────────────────────────────────────────────────────
  if (!report.length) {
    console.log('\n✅ Không có ô nào trống tiếng Anh. Trang /en đã đủ tiếng Anh.');
    return;
  }
  console.log(`\n⚠️  Có ${report.length} ô đang trống tiếng Anh (đang hiện tiếng Việt):\n`);
  for (const r of report) {
    console.log(`• [${r.loc}] ${r.field}${r.rich ? ' (RICHTEXT)' : ''}`);
    console.log(`    VI: ${r.vi.replace(/\n/g, '\n        ')}\n`);
  }
  console.log('\n===== JSON (copy nguyên khối này gửi lại) =====');
  console.log(JSON.stringify(report, null, 0));
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
