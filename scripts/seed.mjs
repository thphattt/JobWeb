/**
 * Seed nội dung hiện tại vào Payload CMS qua REST API (chạy khi dev server đang bật).
 *   node scripts/seed.mjs
 * Idempotent: globals được ghi đè; collections bị xoá sạch rồi tạo lại.
 * Yêu cầu biến môi trường SEED_EMAIL / SEED_PASSWORD (tài khoản admin).
 */
const BASE = process.env.SEED_BASE || 'http://localhost:3000/api';
const EMAIL = process.env.SEED_EMAIL;
const PASSWORD = process.env.SEED_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('Thiếu SEED_EMAIL / SEED_PASSWORD.');
  process.exit(1);
}

let token = '';
const H = () => ({
  'Content-Type': 'application/json',
  Authorization: `JWT ${token}`
});
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
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
  }
  return json;
}

async function setGlobal(slug, vi, en) {
  const viDoc = pick(await req('POST', `/globals/${slug}?locale=vi&depth=0`, vi));
  // Ghép id của các phần tử mảng (vi) vào bản en để localize đúng dòng.
  const enBody = typeof en === 'function' ? en(viDoc) : en;
  await req('POST', `/globals/${slug}?locale=en&depth=0`, enBody);
  console.log(`  ✓ global ${slug}`);
}

async function resetCollection(slug) {
  const list = await req('GET', `/${slug}?limit=200&depth=0`);
  for (const d of list.docs || []) {
    await req('DELETE', `/${slug}/${d.id}`);
  }
}

async function createDoc(slug, vi, en) {
  const created = pick(await req('POST', `/${slug}?locale=vi&depth=0`, vi));
  await req('PATCH', `/${slug}/${created.id}?locale=en&depth=0`, en);
  return created.id;
}

async function main() {
  // ── Đăng nhập ────────────────────────────────────────────────────────────
  const login = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  }).then((r) => r.json());
  token = login.token;
  if (!token) throw new Error('Đăng nhập thất bại: ' + JSON.stringify(login));
  console.log('Đã đăng nhập, bắt đầu seed…');

  // ── Hero ─────────────────────────────────────────────────────────────────
  await setGlobal(
    'hero',
    {
      eyebrow: 'Tổ chức sự kiện · Truyền thông',
      title: 'Kiến tạo những chương trình sự kiện tầm vóc',
      subtitle:
        'Từ ý tưởng, kịch bản đến sản xuất trọn gói - Tân Châu Thành đồng hành cùng các sự kiện chính trị, văn hóa quy mô lớn từ năm 2018.',
      ctaPrimary: 'Liên hệ ngay',
      ctaSecondary: 'Xem dịch vụ'
    },
    {
      eyebrow: 'Events · Communications',
      title: 'Crafting events of national scale',
      subtitle:
        'From concept and script to full production - Tan Chau Thanh has delivered large-scale political and cultural events since 2018.',
      ctaPrimary: 'Get in touch',
      ctaSecondary: 'Our services'
    }
  );

  // ── About ────────────────────────────────────────────────────────────────
  await setGlobal(
    'about',
    {
      eyebrow: 'Về chúng tôi',
      title: 'Đối tác tổ chức sự kiện & truyền thông từ 2018',
      body: 'Tân Châu Thành cung cấp giải pháp sự kiện trọn gói: đạo diễn, kịch bản, tổ chức sản xuất, nhân sự và thiết bị. Đội ngũ giàu kinh nghiệm, từng tham gia nhiều chương trình cấp quốc gia như bế mạc SEA Games 22 và Đại lễ 1000 năm Thăng Long – Hà Nội.'
    },
    {
      eyebrow: 'About us',
      title: 'Your events & communications partner since 2018',
      body: 'Tan Chau Thanh delivers end-to-end event solutions: directing, scripting, production, staffing and equipment. Our experienced team has contributed to national-scale programs including the SEA Games 22 closing ceremony and the 1000th Anniversary of Thang Long – Hanoi.'
    }
  );

  // ── Why (mảng localized → ghép id) ────────────────────────────────────────
  const whyVi = [
    {
      title: 'Giải pháp trọn gói',
      description: 'Từ ý tưởng, kịch bản đến sản xuất và vận hành tại hiện trường.'
    },
    {
      title: 'Đội ngũ giàu kinh nghiệm',
      description: 'Từng tham gia nhiều chương trình quy mô cấp quốc gia.'
    },
    {
      title: 'Thiết bị quy mô lớn',
      description: 'Âm thanh, ánh sáng, sân khấu hiện đại, hoành tráng.'
    },
    {
      title: 'Bền bỉ từ 2018',
      description: 'Nhiều năm đồng hành cùng các sự kiện chính trị, văn hóa.'
    }
  ];
  const whyEn = [
    {
      title: 'End-to-end solutions',
      description: 'From concept and script to production and on-site operations.'
    },
    {
      title: 'Experienced team',
      description: 'Contributors to many national-scale programs.'
    },
    {
      title: 'Large-scale equipment',
      description: 'Modern sound, lighting and staging at grand scale.'
    },
    {
      title: 'Trusted since 2018',
      description: 'Years of delivering political and cultural events.'
    }
  ];
  await setGlobal(
    'why',
    {
      eyebrow: 'Vì sao chọn chúng tôi',
      title: 'Đối tác sự kiện bạn có thể tin tưởng',
      items: whyVi
    },
    (viDoc) => ({
      eyebrow: 'Why choose us',
      title: 'An events partner you can rely on',
      items: (viDoc.items || []).map((it, i) => ({ id: it.id, ...whyEn[i] }))
    })
  );

  // ── ContactInfo (offices.address localized → ghép id) ─────────────────────
  const offices = [
    '26 Trần Quốc Toản, P. Cửa Nam, Hà Nội',
    '44 ngõ 36a Trần Điền, P. Phương Liệt, Hà Nội'
  ];
  await setGlobal(
    'contactInfo',
    {
      offices: offices.map((address) => ({ address })),
      phones: [
        { number: '0243.822.9251' },
        { number: '091.353.2566' },
        { number: '091.949.6886' }
      ],
      email: 'tanchauthanhhn@gmail.com',
      facebook: 'https://www.facebook.com/TanChauThanhhn/'
    },
    (viDoc) => ({
      offices: (viDoc.offices || []).map((o, i) => ({
        id: o.id,
        address: offices[i]
      }))
    })
  );

  // ── Brand ────────────────────────────────────────────────────────────────
  await setGlobal(
    'brand',
    {
      name: 'Công ty TNHH Tân Châu Thành',
      tagline: 'Đối tác tổ chức sự kiện & truyền thông chuyên nghiệp.'
    },
    {
      name: 'Tan Chau Thanh Co., Ltd',
      tagline: 'Your professional events & communications partner.'
    }
  );

  // ── Services ─────────────────────────────────────────────────────────────
  await resetCollection('services');
  const servicesData = [
    {
      icon: 'clapperboard',
      order: 0,
      vi: {
        title: 'Đạo diễn & Kịch bản',
        description:
          'Xây dựng ý tưởng, kịch bản và đạo diễn cho các chương trình, sự kiện.'
      },
      en: {
        title: 'Directing & Scripting',
        description:
          'Concept development, scripting and directing for programs and events.'
      }
    },
    {
      icon: 'layers',
      order: 1,
      vi: {
        title: 'Tổ chức sản xuất',
        description:
          'Quản lý và tổ chức sản xuất chương trình trọn gói, chuyên nghiệp.'
      },
      en: {
        title: 'Production',
        description: 'End-to-end, professional program production management.'
      }
    },
    {
      icon: 'users',
      order: 2,
      vi: {
        title: 'Nhân sự sự kiện',
        description:
          'Ban nhạc, ca sĩ, MC, nhóm múa, nhóm nhảy, lễ tân chuyên nghiệp.'
      },
      en: {
        title: 'Event talent',
        description: 'Bands, singers, MCs, dance and performance groups, hostesses.'
      }
    },
    {
      icon: 'speaker',
      order: 3,
      vi: {
        title: 'Thiết bị sự kiện',
        description:
          'Âm thanh, ánh sáng, sân khấu, nhạc cụ hiện đại, quy mô hoành tráng.'
      },
      en: {
        title: 'Event equipment',
        description: 'Modern sound, lighting, staging and instruments at grand scale.'
      }
    }
  ];
  for (const s of servicesData) {
    await createDoc(
      'services',
      { ...s.vi, icon: s.icon, order: s.order },
      { ...s.en }
    );
  }
  console.log(`  ✓ services (${servicesData.length})`);

  // ── Projects ─────────────────────────────────────────────────────────────
  await resetCollection('projects');
  const projectsData = [
    {
      year: '2003',
      order: 0,
      vi: { title: 'Bế mạc SEA Games 22', venue: 'SVĐ Mỹ Đình, Hà Nội' },
      en: {
        title: 'SEA Games 22 closing ceremony',
        venue: 'My Dinh Stadium, Hanoi'
      }
    },
    {
      year: '2010',
      order: 1,
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
      year: '2015',
      order: 2,
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
      year: '2018',
      order: 3,
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
      year: '2019',
      order: 4,
      vi: {
        title: '“Tôi yêu Tổ quốc tôi” tại Đền Hùng',
        venue: 'TW Hội LHTN Việt Nam'
      },
      en: {
        title: '“I love my Fatherland” at Hung Temple',
        venue: 'Vietnam Youth Federation'
      }
    },
    {
      year: '',
      order: 5,
      vi: {
        title: 'Chào mừng Đại hội Đảng bộ các cấp',
        venue: 'Hướng tới Đại hội Đảng toàn quốc lần thứ XIV'
      },
      en: {
        title: 'Welcoming Party congresses',
        venue: 'Toward the 14th National Party Congress'
      }
    }
  ];
  for (const p of projectsData) {
    await createDoc(
      'projects',
      { ...p.vi, year: p.year, order: p.order },
      { ...p.en }
    );
  }
  console.log(`  ✓ projects (${projectsData.length})`);

  console.log('Seed hoàn tất.');
}

main().catch((e) => {
  console.error('Seed lỗi:', e);
  process.exit(1);
});
