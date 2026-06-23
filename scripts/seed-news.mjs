/**
 * Seed "Gương mặt hợp tác tiêu biểu" + vài bài Tin tức mẫu (song ngữ) qua REST.
 *   SEED_EMAIL=... SEED_PASSWORD=... node scripts/seed-news.mjs
 * Idempotent: xoá sạch 2 collection rồi tạo lại.
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

async function resetCollection(slug) {
  const list = await req('GET', `/${slug}?limit=200&depth=0`);
  for (const d of list.docs || []) await req('DELETE', `/${slug}/${d.id}`);
}

/** Lexical richtext tối thiểu từ danh sách đoạn văn. */
function lex(paragraphs) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            version: 1,
            text,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0
          }
        ]
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
  console.log('Đã đăng nhập, seed tin tức + gương mặt…');

  // ── Gương mặt hợp tác tiêu biểu ───────────────────────────────────────────
  await resetCollection('collaborators');
  const people = [
    { name: 'NSND Quang Thọ', vi: 'NSND', en: "People's Artist" },
    { name: 'NSND Quốc Hưng', vi: 'NSND', en: "People's Artist" },
    { name: 'Đăng Dương', vi: 'Ca sĩ', en: 'Singer' },
    { name: 'Trọng Tấn', vi: 'Ca sĩ', en: 'Singer' },
    { name: 'NSƯT Anh Thơ', vi: 'NSƯT', en: 'Meritorious Artist' },
    { name: 'Việt Hoàn', vi: 'Ca sĩ', en: 'Singer' },
    { name: 'NSƯT Lan Anh', vi: 'NSƯT', en: 'Meritorious Artist' },
    { name: 'MC Hoài Anh', vi: 'MC', en: 'MC' },
    { name: 'MC Sơn Lâm', vi: 'MC', en: 'MC' },
    { name: 'MC Hồng Nhung', vi: 'MC', en: 'MC' }
  ];
  let order = 0;
  for (const p of people) {
    const created = pick(
      await req('POST', `/collaborators?locale=vi&depth=0`, {
        name: p.name,
        role: p.vi,
        order: order++
      })
    );
    await req('PATCH', `/collaborators/${created.id}?locale=en&depth=0`, { role: p.en });
  }
  console.log(`  ✓ collaborators (${people.length})`);

  // ── Tin tức ───────────────────────────────────────────────────────────────
  await resetCollection('news');
  const posts = [
    {
      date: '2026-05-18',
      vi: {
        title: 'Tân Châu Thành đồng hành cùng chuỗi sự kiện chào mừng Đại hội Đảng bộ các cấp',
        excerpt:
          'Chúng tôi tham gia tổ chức và sản xuất nhiều chương trình nghệ thuật chào mừng Đại hội Đảng bộ các cấp, hướng tới Đại hội Đảng toàn quốc lần thứ XIV.',
        body: [
          'Trong năm 2026, Tân Châu Thành tiếp tục đồng hành cùng nhiều địa phương và đơn vị trong việc tổ chức các chương trình nghệ thuật chào mừng Đại hội Đảng bộ các cấp.',
          'Từ xây dựng kịch bản, đạo diễn sân khấu đến huy động nhân sự và thiết bị, đội ngũ của chúng tôi đảm bảo mỗi chương trình diễn ra trang trọng, giàu cảm xúc và đúng tiến độ.'
        ]
      },
      en: {
        title: 'Tan Chau Thanh accompanies events welcoming the Party congresses',
        excerpt:
          'We help organize and produce art programs welcoming Party congresses at all levels, toward the 14th National Party Congress.',
        body: [
          'Throughout 2026, Tan Chau Thanh continues to work with localities and organizations to deliver art programs welcoming Party congresses at all levels.',
          'From scripting and stage directing to staffing and equipment, our team ensures every program is dignified, emotional and on schedule.'
        ]
      }
    },
    {
      date: '2026-04-02',
      vi: {
        title: 'Hậu trường sản xuất chương trình nghệ thuật quy mô lớn',
        excerpt:
          'Một góc nhìn về quá trình chuẩn bị sân khấu, âm thanh, ánh sáng và nhân sự cho những chương trình hàng nghìn khán giả.',
        body: [
          'Đằng sau mỗi đêm diễn thành công là hàng tuần chuẩn bị: dựng sân khấu, căn chỉnh âm thanh – ánh sáng, tổng duyệt cùng nghệ sĩ và ê-kíp.',
          'Tân Châu Thành sở hữu hệ thống thiết bị quy mô lớn cùng đội ngũ kỹ thuật giàu kinh nghiệm, sẵn sàng cho các chương trình tầm vóc.'
        ]
      },
      en: {
        title: 'Behind the scenes of a large-scale art program',
        excerpt:
          'A look at preparing stage, sound, lighting and crew for programs with thousands of audience members.',
        body: [
          'Behind every successful show are weeks of preparation: stage building, sound and lighting calibration, and full rehearsals with artists and crew.',
          'Tan Chau Thanh owns large-scale equipment and an experienced technical team, ready for programs of national scale.'
        ]
      }
    },
    {
      date: '2026-02-20',
      vi: {
        title: 'Tuyển cộng tác viên sự kiện mùa cao điểm 2026',
        excerpt:
          'Tân Châu Thành tìm kiếm các cộng tác viên nhân sự sự kiện: lễ tân, hậu cần, kỹ thuật cho mùa cao điểm.',
        body: [
          'Để đáp ứng khối lượng chương trình ngày càng lớn, chúng tôi mở rộng mạng lưới cộng tác viên trong nhiều mảng: lễ tân, hậu cần, kỹ thuật sân khấu.',
          'Ứng viên quan tâm vui lòng liên hệ qua hotline hoặc email để biết thêm chi tiết.'
        ]
      },
      en: {
        title: 'Recruiting event collaborators for the 2026 peak season',
        excerpt:
          'Tan Chau Thanh is looking for event staff collaborators: hostesses, logistics and technicians for the peak season.',
        body: [
          'To meet a growing volume of programs, we are expanding our collaborator network across hostessing, logistics and stage technical roles.',
          'Interested candidates please reach us via hotline or email for more details.'
        ]
      }
    }
  ];
  for (const p of posts) {
    const created = pick(
      await req('POST', `/news?locale=vi&depth=0`, {
        title: p.vi.title,
        date: new Date(p.date).toISOString(),
        excerpt: p.vi.excerpt,
        content: lex(p.vi.body),
        published: true
      })
    );
    await req('PATCH', `/news/${created.id}?locale=en&depth=0`, {
      title: p.en.title,
      excerpt: p.en.excerpt,
      content: lex(p.en.body)
    });
    console.log(`  ✓ news: ${created.slug}`);
  }

  console.log('Seed tin tức + gương mặt hoàn tất.');
}

main().catch((e) => {
  console.error('Seed lỗi:', e);
  process.exit(1);
});
