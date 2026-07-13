/**
 * Thêm bài Tin tức MẪU (song ngữ) để xem phân trang — KHÔNG xoá bài cũ.
 * Mỗi bài gắn nhãn "(mẫu)" ở tiêu đề để dễ tìm & xoá sau.
 *   SEED_EMAIL=... SEED_PASSWORD=... node scripts/seed-news-samples.mjs
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
          { type: 'text', version: 1, text, format: 0, style: '', mode: 'normal', detail: 0 }
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
  console.log('Đã đăng nhập. Thêm bài tin mẫu…\n');

  const posts = [
    {
      date: '2026-07-01',
      vi: {
        title: 'Khởi động mùa sự kiện hè 2026 (mẫu)',
        excerpt:
          'Tân Châu Thành chuẩn bị hạ tầng sân khấu và nhân sự cho chuỗi chương trình mùa hè.'
      },
      en: {
        title: 'Kicking off the 2026 summer event season (sample)',
        excerpt: 'Tan Chau Thanh prepares stages and crew for a busy summer schedule.'
      }
    },
    {
      date: '2026-06-15',
      vi: {
        title: 'Đầu tư hệ thống màn hình LED thế hệ mới (mẫu)',
        excerpt: 'Nâng cấp thiết bị hình ảnh phục vụ các chương trình quy mô lớn.'
      },
      en: {
        title: 'Investing in a new-generation LED screen system (sample)',
        excerpt: 'Upgrading visual equipment for large-scale programs.'
      }
    },
    {
      date: '2026-06-03',
      vi: {
        title: 'Ký kết hợp tác truyền thông cùng đối tác chiến lược (mẫu)',
        excerpt: 'Mở rộng mạng lưới đối tác trong lĩnh vực tổ chức sự kiện và truyền thông.'
      },
      en: {
        title: 'Signing a media partnership with a strategic partner (sample)',
        excerpt: 'Expanding our partner network in events and communications.'
      }
    },
    {
      date: '2026-05-05',
      vi: {
        title: 'Tổng kết chương trình nghệ thuật chào mừng tháng 4 (mẫu)',
        excerpt: 'Nhìn lại một chương trình được đầu tư công phu về sân khấu và nội dung.'
      },
      en: {
        title: 'Recap of the April celebration art program (sample)',
        excerpt: 'Looking back at a program with an elaborate stage and content.'
      }
    },
    {
      date: '2026-03-22',
      vi: {
        title: 'Đào tạo đội ngũ đạo diễn sân khấu trẻ (mẫu)',
        excerpt: 'Chương trình huấn luyện nội bộ nâng cao năng lực dàn dựng.'
      },
      en: {
        title: 'Training young stage directors (sample)',
        excerpt: 'An internal program to strengthen staging capabilities.'
      }
    },
    {
      date: '2026-01-30',
      vi: {
        title: 'Nhìn lại một năm đồng hành cùng khách hàng (mẫu)',
        excerpt: 'Tổng kết các chương trình tiêu biểu và cột mốc trong năm.'
      },
      en: {
        title: 'A year of standing beside our clients (sample)',
        excerpt: 'A summary of notable programs and milestones of the year.'
      }
    },
    {
      date: '2025-12-12',
      vi: {
        title: 'Gala cuối năm cho doanh nghiệp đối tác (mẫu)',
        excerpt: 'Sản xuất chương trình gala tri ân với sân khấu ấm cúng, chuyên nghiệp.'
      },
      en: {
        title: 'Year-end gala for partner enterprises (sample)',
        excerpt: 'Producing a warm, professional appreciation gala.'
      }
    },
    {
      date: '2025-11-08',
      vi: {
        title: 'Ứng dụng công nghệ trình chiếu 3D mapping (mẫu)',
        excerpt: 'Thử nghiệm hiệu ứng thị giác mới cho các sân khấu ngoài trời.'
      },
      en: {
        title: 'Applying 3D projection mapping technology (sample)',
        excerpt: 'Piloting new visual effects for outdoor stages.'
      }
    },
    {
      date: '2025-09-19',
      vi: {
        title: 'Mở rộng văn phòng và kho thiết bị tại Hà Nội (mẫu)',
        excerpt: 'Tăng năng lực lưu trữ và sẵn sàng thiết bị cho mùa cao điểm.'
      },
      en: {
        title: 'Expanding office and equipment warehouse in Hanoi (sample)',
        excerpt: 'Increasing storage and equipment readiness for peak season.'
      }
    }
  ];

  const body = (excerpt) => [
    excerpt,
    'Đây là nội dung mẫu để minh hoạ bố cục trang chi tiết. Bạn có thể chỉnh sửa hoặc xoá bài này trong trang quản trị (Admin → News).'
  ];
  const bodyEn = (excerpt) => [
    excerpt,
    'This is sample content to illustrate the detail page layout. You can edit or delete this post in the admin (Admin → News).'
  ];

  for (const p of posts) {
    const created = pick(
      await req('POST', `/news?locale=vi&depth=0`, {
        title: p.vi.title,
        date: new Date(p.date).toISOString(),
        excerpt: p.vi.excerpt,
        content: lex(body(p.vi.excerpt)),
        published: true
      })
    );
    await req('PATCH', `/news/${created.id}?locale=en&depth=0`, {
      title: p.en.title,
      excerpt: p.en.excerpt,
      content: lex(bodyEn(p.en.excerpt))
    });
    console.log(`  ✓ ${created.slug}`);
  }

  const total = (await req('GET', `/news?limit=0&depth=0`)).totalDocs;
  console.log(`\n✅ Đã thêm ${posts.length} bài mẫu. Tổng số tin: ${total}.`);
}

main().catch((e) => {
  console.error('Lỗi:', e);
  process.exit(1);
});
