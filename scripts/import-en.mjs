/**
 * Nhập bản dịch TIẾNG ANH vào đúng các bản ghi hiện có (chỉ set locale=en,
 * KHÔNG đụng tiếng Việt, KHÔNG đổi ID). Chạy trên VPS nơi app chạy ở cổng 3000.
 *
 *   SEED_EMAIL=admin@... SEED_PASSWORD=... node scripts/import-en.mjs
 *
 * Bản dịch do máy tạo — khách có thể chỉnh lại trong /admin (tab English) bất kỳ lúc nào.
 */
const BASE = process.env.SEED_BASE || 'http://localhost:3000/api';
const EMAIL = process.env.SEED_EMAIL || process.env.ADMIN_EMAIL;
const PASSWORD = process.env.SEED_PASSWORD || process.env.ADMIN_PASSWORD;
if (!EMAIL || !PASSWORD) {
  console.error('Thiếu SEED_EMAIL / SEED_PASSWORD (tài khoản admin).');
  process.exit(1);
}

let token = '';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `JWT ${token}` });

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: H(),
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : {};
}

/** Dựng cấu trúc Lexical richtext từ danh sách đoạn văn. */
function lexical(paragraphs) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((t) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: t
          ? [{ type: 'text', format: 0, style: '', mode: 'normal', detail: 0, text: t, version: 1 }]
          : []
      }))
    }
  };
}

const SAMPLE_TAIL =
  'This is sample content to illustrate the detail page layout. You can edit or delete this post in the admin (Admin → News).';

// ── GLOBALS (chỉ trường phẳng; mảng cần ghép id) ────────────────────────────
const heroEn = {
  eyebrow: 'Events · Communications',
  title: 'Crafting programs of national scale',
  subtitle:
    'From concept and script to full production — Tan Chau Thanh has accompanied large-scale political and cultural events since 2018.',
  ctaPrimary: 'Get in touch',
  ctaSecondary: 'Our services'
};
const brandEn = {
  name: 'Tan Chau Thanh Co., Ltd',
  tagline: 'Your professional events & communications partner.'
};
const statsEn = {
  eyebrow: 'Impressive numbers',
  title: 'Tan Chau Thanh in numbers',
  items: ['Years of experience', 'Programs delivered', 'Artists & collaborators', 'Offices in Hanoi']
};
const whyEn = {
  eyebrow: 'Why choose us',
  title: 'An events partner you can rely on',
  items: [
    { title: 'End-to-end solutions', description: 'From concept and script to on-site production and operations.' },
    { title: 'Experienced team', description: 'Contributors to many national-scale programs.' },
    { title: 'Large-scale equipment', description: 'Modern sound, lighting and grand staging.' },
    { title: 'Enduring since 2018', description: 'Years of accompanying political and cultural events.' }
  ]
};
const officesEn = ['26 Tran Quoc Toan, Cua Nam Ward, Hanoi', '44 Lane 36A Tran Dien, Phuong Liet Ward, Hanoi'];

// ── SERVICES (id → en) ──────────────────────────────────────────────────────
const servicesEn = {
  1: { title: 'Directing & Scripting', description: 'Concept development, scripting and directing for programs and events.' },
  2: { title: 'Production', description: 'Professional, end-to-end program production management.' },
  3: { title: 'Event talent', description: 'Bands, singers, MCs, dance and performance groups, professional hostesses.' },
  4: { title: 'Event equipment', description: 'Modern sound, lighting, staging and instruments at grand scale.' }
};

// ── PROJECTS (id → en) ──────────────────────────────────────────────────────
const projectsEn = {
  7: { title: 'SEA Games 22 Closing Ceremony', venue: 'My Dinh National Stadium, Hanoi' },
  8: { title: '1000th Anniversary of Thang Long – Hanoi', venue: 'Stage No. 5 “City for Peace”' },
  9: { title: '“I Love My Fatherland”', venue: 'My Dinh Square — a 10,000-member card stunt by the Hanoi Youth Union' },
  10: {
    title: '“I Love My Fatherland” Journey at the Hung Kings Temple Historical Site',
    venue: 'Central Committee of the Ho Chi Minh Communist Youth Union'
  },
  11: { title: '01', venue: 'Vietnam–Soviet Friendship Cultural Palace' },
  13: { title: '02', venue: 'Stadium — Dong Da District Culture & Sports Center' },
  12: { title: '03', venue: 'Square at the Determined-to-Die Soldiers Monument — Hoan Kiem Lake' },
  14: { title: '04', venue: 'Dong Kinh Nghia Thuc Square' }
};

// ── TESTIMONIALS (id → en) ──────────────────────────────────────────────────
const testimonialsEn = {
  1: { quote: 'Tan Chau Thanh organized the program very professionally, creatively and on schedule. We are very satisfied.', role: 'Head of the Organizing Committee' },
  2: { quote: 'A dedicated team with flexible on-site handling. Our event went perfectly, beyond expectations.', role: 'Marketing Director' },
  3: { quote: 'From script to production, everything was meticulous. A reliable event partner.', role: 'Organizing unit representative' }
};

// ── NEWS (id → en) ──────────────────────────────────────────────────────────
const newsEn = {
  6: {
    title: 'Tan Chau Thanh Media delivers a program at the Head Office of the Vietnam Bank for Social Policies',
    excerpt: 'TAN CHAU THANH SUCCESSFULLY ORGANIZES THE EVENT',
    content: [
      'Tan Chau Thanh Communications Co., Ltd was honored to be the organizer of a program held at the Head Office of the Vietnam Bank for Social Policies. The event took place in a solemn, professional atmosphere, leaving a positive impression and affirming the quality of our organization.',
      'Drawing on our experience in event organization, Tan Chau Thanh Media handled every element — from building the organizational plan, designing the event space, constructing the stage and installing the sound, lighting and LED-screen systems, to coordinating personnel and running the program.',
      'Throughout the implementation, our technical and operations team followed the script closely and coordinated tightly with the Organizing Committee to ensure every activity ran on schedule, safely and effectively. Every detail was carefully prepared to deliver a polished program meeting the highest standards of quality and professionalism.',
      "The event at the Head Office of the Vietnam Bank for Social Policies is further proof of Tan Chau Thanh Communications Co., Ltd's capability in organizing programs for state agencies, financial institutions and businesses nationwide.",
      'In the coming time, Tan Chau Thanh Media will continue to leverage its strengths in creativity, technology and its experienced team to deliver professional event solutions, contributing to the success of every program and building lasting value for clients and partners.'
    ]
  },
  4: {
    title: "Commemorating President Ho Chi Minh's Birthday",
    excerpt: 'TAN CHAU THANH COMMUNICATIONS SUCCESSFULLY ORGANIZES THE EVENT',
    content: [
      "Tan Chau Thanh co-organizes an art program at the Vietnam–Soviet Friendship Cultural Palace on the occasion of President Ho Chi Minh's Birthday.",
      "Hanoi – Sharing in the sacred and proud atmosphere of the whole nation toward the commemoration of President Ho Chi Minh's Birthday (May 19), Tan Chau Thanh Communications Co., Ltd was honored to be the organizer of an art program held at the Vietnam–Soviet Friendship Cultural Palace.",
      'The program was elaborately invested — from stage design, sound, lighting and LED-screen systems to coordination, operation and performance management. The outstanding, professionally staged performances vividly recreated the image, ideology and great contributions of President Ho Chi Minh to the cause of national liberation and nation-building.',
      'With a professional, responsible and creative spirit, the Tan Chau Thanh Media team coordinated closely with the Organizing Committee and related units to ensure the program took place solemnly, safely and successfully. Every item was carefully prepared to create an emotionally rich artistic space, spreading historical, cultural and patriotic values to the audience.',
      'The event was not only a meaningful activity to remember and honor the great merits of President Ho Chi Minh, but also affirmed the capability of Tan Chau Thanh Communications Co., Ltd in event organization, art program production and professional communications solutions.',
      'In the coming time, Tan Chau Thanh will continue to innovate, improve service quality and accompany agencies, organizations and businesses in creating large-scale, valuable and memorable programs.',
      'Tan Chau Thanh Media sincerely thanks our partners and the Organizing Committee for their trust. This is our motivation to keep delivering quality programs that contribute to successful and meaningful events in the future.'
    ]
  },
  1: {
    title: 'Where emotions soar with Tan Chau Thanh Media',
    content: [
      'Every art program is not merely a performance but a journey of storytelling through music, light and emotion. With experience organizing hundreds of events large and small, Tan Chau Thanh Communications Co., Ltd delivered an art program invested methodically, professionally and rich in artistic value.',
      'From creative ideas, scriptwriting and stage design to operating the sound, lighting and LED-screen systems and coordinating the program, every element was carefully prepared by the Tan Chau Thanh team to create an impressive, modern and deeply moving performance space.',
      'The elaborately staged performances, harmoniously blending traditional art with modern elements, brought the audience unforgettable moments. Synchronized technical systems and professional stage effects highlighted each performance, creating a visually stunning and emotional artistic feast.',
      'With the motto "Professional – Creative – Dedicated", Tan Chau Thanh Media always puts quality first, constantly innovating to deliver art programs with a distinct signature that meet the needs of each client and partner.',
      "The program's success further affirms the capability of Tan Chau Thanh Communications Co., Ltd in event organization, art program production and comprehensive communications solutions. We are committed to continuing to accompany agencies, organizations and businesses to create professional, distinctive and valuable events."
    ]
  },
  5: {
    title: 'Tan Chau Thanh Media organizes the Final Round of the contest seeking ideas and solutions for administrative reform in Hanoi',
    excerpt: 'Tan Chau Thanh Communications Co., Ltd was honored to organize the Final Round of the contest seeking ideas and solutions for administrative reform in Hanoi.',
    content: [
      "Tan Chau Thanh Communications Co., Ltd was honored to organize the Final Round of the contest seeking ideas and solutions for administrative reform in Hanoi — a meaningful event encouraging innovative initiatives and solutions, contributing to improving the capital's administration toward a modern, effective and people-serving model.",
      'The program gathered many outstanding ideas and solutions selected from the preliminary round. In the final round, authors and author groups directly presented and defended their ideas before the Jury, with many creative proposals highly applicable to administrative reform and digital transformation.',
      'As the event organizer, Tan Chau Thanh Media handled everything from building the organizational script, stage design, construction and installation of the sound, lighting and LED-screen systems, to program coordination and technical operation throughout the event. With thorough preparation and an experienced team, the program ran professionally and solemnly, on schedule and meeting the Organizing Committee’s requirements.',
      "The program's success further affirms Tan Chau Thanh Communications Co., Ltd's capability in organizing events, conferences, seminars and large-scale programs for state agencies, organizations and businesses.",
      'Tan Chau Thanh Media sincerely thanks the Organizing Committee and partners for their trust. In the coming time, we will continue to deliver professional, creative and effective event solutions, contributing to successful programs that spread positive values to the community.'
    ]
  },
  2: {
    title: 'Behind the scenes of large-scale art program production',
    excerpt: 'A look at preparing the stage, sound, lighting and personnel for programs with thousands of spectators.',
    content: [
      'Behind every successful show are weeks of preparation: building the stage, tuning sound and lighting, and rehearsing with artists and crew.',
      'Tan Chau Thanh owns a large-scale equipment system and an experienced technical team, ready for programs of significant scale.'
    ]
  },
  3: {
    title: 'Recruiting event collaborators for the 2026 peak season',
    excerpt: 'Tan Chau Thanh is looking for event personnel collaborators: hostesses, logistics and technical staff for the peak season.',
    content: [
      'To meet the growing volume of programs, we are expanding our network of collaborators across many areas: reception/hostessing, logistics and stage technical work.',
      'Interested candidates please contact us via hotline or email for more details.'
    ]
  },
  // Bài MẪU (mẫu) — có thể xoá sau
  7: { title: 'Wrap-up of the April celebration art program (sample)', excerpt: 'A look back at a program with elaborate investment in stage and content.', content: ['A look back at a program with elaborate investment in stage and content.', SAMPLE_TAIL] },
  8: { title: 'Training young stage directors (sample)', excerpt: 'An internal training program to enhance staging capabilities.', content: ['An internal training program to enhance staging capabilities.', SAMPLE_TAIL] },
  9: { title: 'A year of accompanying our clients — in review (sample)', excerpt: 'A summary of outstanding programs and milestones during the year.', content: ['A summary of outstanding programs and milestones during the year.', SAMPLE_TAIL] },
  10: { title: 'Year-end gala for partner businesses (sample)', excerpt: 'Producing a thank-you gala program with a warm, professional stage.', content: ['Producing a thank-you gala program with a warm, professional stage.', SAMPLE_TAIL] },
  11: { title: 'Applying 3D mapping projection technology (sample)', excerpt: 'Testing new visual effects for outdoor stages.', content: ['Testing new visual effects for outdoor stages.', SAMPLE_TAIL] },
  12: { title: 'Expanding the office and equipment warehouse in Hanoi (sample)', excerpt: 'Increasing storage capacity and equipment readiness for the peak season.', content: ['Increasing storage capacity and equipment readiness for the peak season.', SAMPLE_TAIL] }
};

const META = new Set(['id', 'createdAt', 'updatedAt', 'globalType']);
const strip = (o) => {
  const c = { ...o };
  for (const k of META) delete c[k];
  return c;
};
/** Đọc bản en hiện tại (không fallback) rồi ghép override → POST. An toàn, không ghi đè field khác. */
async function updateGlobal(slug, build) {
  const cur = strip(await req('GET', `/globals/${slug}?locale=en&fallback-locale=none&depth=0`));
  await req('POST', `/globals/${slug}?locale=en&depth=0`, build(cur));
  console.log(`  ✓ global ${slug}`);
}
async function patchDoc(slug, id, en) {
  try {
    await req('PATCH', `/${slug}/${id}?locale=en&depth=0`, en);
    console.log(`  ✓ ${slug} #${id}`);
  } catch (e) {
    console.warn(`  ⚠ bỏ qua ${slug} #${id}: ${e.message}`);
  }
}

async function main() {
  const login = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  }).then((r) => r.json());
  token = login.token;
  if (!token) throw new Error('Đăng nhập thất bại: ' + JSON.stringify(login).slice(0, 200));
  console.log('Đã đăng nhập, bắt đầu nhập tiếng Anh…');

  // Globals (ghép vào bản hiện tại)
  await updateGlobal('hero', (cur) => ({ ...cur, ...heroEn }));
  await updateGlobal('brand', (cur) => ({ ...cur, ...brandEn }));
  await updateGlobal('stats', (cur) => ({
    ...cur,
    eyebrow: statsEn.eyebrow,
    title: statsEn.title,
    items: (cur.items || []).map((it, i) => ({ ...it, label: statsEn.items[i] ?? it.label }))
  }));
  await updateGlobal('why', (cur) => ({
    ...cur,
    eyebrow: whyEn.eyebrow,
    title: whyEn.title,
    items: (cur.items || []).map((it, i) => ({ ...it, ...(whyEn.items[i] || {}) }))
  }));
  await updateGlobal('contactInfo', (cur) => ({
    ...cur,
    offices: (cur.offices || []).map((o, i) => ({ ...o, address: officesEn[i] ?? o.address }))
  }));

  // Collections
  for (const [id, en] of Object.entries(servicesEn)) await patchDoc('services', id, en);
  for (const [id, en] of Object.entries(projectsEn)) await patchDoc('projects', id, en);
  for (const [id, en] of Object.entries(testimonialsEn)) await patchDoc('testimonials', id, en);
  for (const [id, en] of Object.entries(newsEn)) {
    const body = { title: en.title, content: lexical(en.content) };
    if (en.excerpt) body.excerpt = en.excerpt;
    await patchDoc('news', id, body);
  }

  console.log('\n✅ Nhập tiếng Anh hoàn tất. Mở /en để kiểm tra.');
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
