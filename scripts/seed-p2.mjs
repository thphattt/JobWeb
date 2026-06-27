/**
 * Seed P2: stats (global) + testimonials + clients + jobs (song ngữ) qua REST.
 *   SEED_EMAIL=... SEED_PASSWORD=... node scripts/seed-p2.mjs
 * Idempotent: globals ghi đè; collections xoá sạch rồi tạo lại.
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
async function reset(slug) {
  const list = await req('GET', `/${slug}?limit=200&depth=0`);
  for (const d of list.docs || []) await req('DELETE', `/${slug}/${d.id}`);
}
function lex(paragraphs) {
  return {
    root: {
      type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0,
        textFormat: 0, textStyle: '',
        children: [{ type: 'text', version: 1, text, format: 0, style: '', mode: 'normal', detail: 0 }]
      }))
    }
  };
}

async function main() {
  const login = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  }).then((r) => r.json());
  token = login.token;
  if (!token) throw new Error('Đăng nhập thất bại: ' + JSON.stringify(login));
  console.log('Đã đăng nhập, seed P2…');

  // ── Stats (global, label localized → ghép id) ─────────────────────────────
  const stats = [
    { value: 7, suffix: '+', vi: 'Năm kinh nghiệm', en: 'Years of experience' },
    { value: 100, suffix: '+', vi: 'Chương trình đã thực hiện', en: 'Programs delivered' },
    { value: 50, suffix: '+', vi: 'Nghệ sĩ & cộng tác viên', en: 'Artists & collaborators' },
    { value: 2, suffix: '', vi: 'Văn phòng tại Hà Nội', en: 'Offices in Hanoi' }
  ];
  const stVi = pick(
    await req('POST', `/globals/stats?locale=vi&depth=0`, {
      eyebrow: 'Con số ấn tượng',
      title: 'Tân Châu Thành trong những con số',
      items: stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.vi }))
    })
  );
  await req('POST', `/globals/stats?locale=en&depth=0`, {
    eyebrow: 'By the numbers',
    title: 'Tan Chau Thanh in numbers',
    items: (stVi.items || []).map((row, i) => ({
      id: row.id, value: stats[i].value, suffix: stats[i].suffix, label: stats[i].en
    }))
  });
  console.log('  ✓ stats');

  // ── Testimonials (quote/role localized) ───────────────────────────────────
  await reset('testimonials');
  const testimonials = [
    {
      author: 'Ông Nguyễn Văn A',
      order: 0,
      viRole: 'Trưởng ban tổ chức', enRole: 'Head of organizing committee',
      vi: 'Tân Châu Thành tổ chức chương trình rất chuyên nghiệp, sáng tạo và đúng tiến độ. Chúng tôi rất hài lòng.',
      en: 'Tan Chau Thanh delivered the program professionally, creatively and on schedule. We were very satisfied.'
    },
    {
      author: 'Bà Trần Thị B',
      order: 1,
      viRole: 'Giám đốc Marketing', enRole: 'Marketing Director',
      vi: 'Đội ngũ tận tâm, xử lý hiện trường linh hoạt. Sự kiện của chúng tôi diễn ra trọn vẹn ngoài mong đợi.',
      en: 'A dedicated team with flexible on-site handling. Our event went beyond expectations.'
    },
    {
      author: 'Ông Lê Văn C',
      order: 2,
      viRole: 'Đại diện đơn vị tổ chức', enRole: 'Client representative',
      vi: 'Từ kịch bản đến sản xuất đều chỉn chu. Một đối tác sự kiện đáng tin cậy.',
      en: 'From script to production, everything was meticulous. A trustworthy event partner.'
    }
  ];
  for (const tm of testimonials) {
    const created = pick(
      await req('POST', `/testimonials?locale=vi&depth=0`, {
        author: tm.author, role: tm.viRole, quote: tm.vi, order: tm.order
      })
    );
    await req('PATCH', `/testimonials/${created.id}?locale=en&depth=0`, {
      role: tm.enRole, quote: tm.en
    });
  }
  console.log(`  ✓ testimonials (${testimonials.length})`);

  // ── Clients (tên placeholder — khách thay logo/tên thật) ──────────────────
  await reset('clients');
  const clients = ['Đối tác A', 'Đối tác B', 'Đối tác C', 'Đối tác D', 'Đối tác E'];
  let co = 0;
  for (const name of clients) {
    await req('POST', `/clients?depth=0`, { name, order: co++ });
  }
  console.log(`  ✓ clients (${clients.length})`);

  // ── Jobs (title/location/summary/description localized) ────────────────────
  await reset('jobs');
  const jobs = [
    {
      type: 'fulltime',
      deadline: '2026-08-31',
      vi: {
        title: 'Nhân viên tổ chức sự kiện',
        location: 'Hà Nội',
        summary: 'Tham gia lên kế hoạch, điều phối và triển khai các chương trình sự kiện của công ty.',
        body: [
          'Phối hợp xây dựng kịch bản, kế hoạch sản xuất và điều phối nhân sự cho sự kiện.',
          'Yêu cầu: tốt nghiệp CĐ/ĐH, năng động, chịu được áp lực, ưu tiên có kinh nghiệm tổ chức sự kiện.'
        ]
      },
      en: {
        title: 'Event Executive',
        location: 'Hanoi',
        summary: 'Plan, coordinate and execute the company’s event programs.',
        body: [
          'Help build scripts, production plans and coordinate staff for events.',
          'Requirements: college/university degree, energetic, able to work under pressure; event experience preferred.'
        ]
      }
    },
    {
      type: 'contract',
      deadline: '',
      vi: {
        title: 'Cộng tác viên hậu cần sự kiện',
        location: 'Hà Nội',
        summary: 'Hỗ trợ hậu cần, dàn dựng và vận hành tại hiện trường trong mùa cao điểm.',
        body: [
          'Hỗ trợ vận chuyển, dàn dựng sân khấu – thiết bị và vận hành tại sự kiện.',
          'Phù hợp với sinh viên/bạn trẻ muốn trải nghiệm ngành tổ chức sự kiện.'
        ]
      },
      en: {
        title: 'Event Logistics Collaborator',
        location: 'Hanoi',
        summary: 'Support logistics, setup and on-site operations during peak season.',
        body: [
          'Assist transport, stage/equipment setup and on-site operations at events.',
          'Suitable for students/young people wanting to experience the events industry.'
        ]
      }
    }
  ];
  for (const j of jobs) {
    const created = pick(
      await req('POST', `/jobs?locale=vi&depth=0`, {
        title: j.vi.title,
        location: j.vi.location,
        type: j.type,
        ...(j.deadline ? { deadline: new Date(j.deadline).toISOString() } : {}),
        summary: j.vi.summary,
        description: lex(j.vi.body),
        published: true
      })
    );
    await req('PATCH', `/jobs/${created.id}?locale=en&depth=0`, {
      title: j.en.title,
      location: j.en.location,
      summary: j.en.summary,
      description: lex(j.en.body)
    });
    console.log(`  ✓ job: ${created.slug}`);
  }

  console.log('Seed P2 hoàn tất.');
}

main().catch((e) => {
  console.error('Seed lỗi:', e);
  process.exit(1);
});
