/**
 * Xoá toàn bộ dữ liệu nội dung TIẾNG ANH trong CMS (mọi bảng *_locales và
 * bảng mảng/khối có cột `_locale`). Sau khi xoá, nhờ `localization.fallback:true`
 * trong payload.config.ts, web tiếng Anh sẽ TỰ hiện nội dung tiếng Việt.
 *
 * → Khách chỉ cần điền tiếng Việt; muốn dịch riêng câu nào thì điền lại ô
 *   tiếng Anh của câu đó (fallback chỉ nhảy vào khi ô tiếng Anh để trống).
 *
 * Chạy THỬ (không xoá gì, chỉ đếm):
 *   node --env-file=.env scripts/clear-english.mjs
 * Xoá THẬT:
 *   node --env-file=.env scripts/clear-english.mjs --apply
 *
 * Nhắm tới DB nào là do DATABASE_URI. Muốn dọn web thật thì trỏ DATABASE_URI
 * vào Postgres của VPS (hoặc chạy ngay trên VPS).
 */
import pg from 'pg';

const APPLY = process.argv.includes('--apply');
const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error('Thiếu DATABASE_URI. Chạy: node --env-file=.env scripts/clear-english.mjs');
  process.exit(1);
}

const client = new pg.Client({ connectionString: uri });
await client.connect();

// Tìm mọi bảng có cột "_locale" (bảng *_locales và bảng mảng/khối song ngữ).
const { rows: tables } = await client.query(`
  SELECT table_name
  FROM information_schema.columns
  WHERE table_schema = 'public' AND column_name = '_locale'
  ORDER BY table_name
`);

if (!tables.length) {
  console.log('Không tìm thấy bảng song ngữ nào.');
  await client.end();
  process.exit(0);
}

console.log(`Chế độ: ${APPLY ? 'XOÁ THẬT (--apply)' : 'CHẠY THỬ (dry-run)'}`);
console.log(`DB: ${uri.replace(/:\/\/[^@]*@/, '://***@')}\n`);

let total = 0;
for (const { table_name } of tables) {
  const { rows } = await client.query(
    `SELECT count(*)::int AS n FROM "${table_name}" WHERE _locale = 'en'`
  );
  const n = rows[0].n;
  if (n === 0) continue;
  total += n;
  if (APPLY) {
    await client.query(`DELETE FROM "${table_name}" WHERE _locale = 'en'`);
    console.log(`  ✓ ${table_name}: đã xoá ${n} dòng tiếng Anh`);
  } else {
    console.log(`  • ${table_name}: ${n} dòng tiếng Anh sẽ bị xoá`);
  }
}

console.log(
  `\nTổng: ${total} dòng.` +
    (APPLY
      ? ' Đã xoá. Web tiếng Anh giờ hiển thị nội dung tiếng Việt.'
      : ' Chưa xoá gì. Thêm --apply để xoá thật.')
);

await client.end();
