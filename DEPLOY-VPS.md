# Kế hoạch đưa JobWeb lên domain thật — VPS đặt tại Việt Nam

> **Yêu cầu khách hàng:** máy chủ đặt ở Việt Nam — web, database PostgreSQL và ảnh upload
> đều nằm trên 1 VPS trong datacenter VN. Không dùng dịch vụ lưu trữ nước ngoài (Neon, Cloudflare R2).
>
> **Stack:** Next.js 15 + Payload CMS 3 + PostgreSQL. Repo: `github.com/thphattt/JobWeb` (nhánh `main`).
> **Domain ví dụ:** `tanchauthanh.com` — thay bằng domain thật khi làm.
> **Đăng ký domain:** làm theo file riêng **`DOMAIN.md`** (Mắt Bão, đứng tên khách).

**Kiến trúc:**

```
Người dùng → DNS (Mắt Bão) → Nginx trên VPS VN (SSL Let's Encrypt, port 80/443)
                                 ├── /uploads/*  → phục vụ file tĩnh trực tiếp
                                 └── còn lại     → Next.js + Payload (PM2, port 3000)
                                                      └── PostgreSQL (localhost)
```

## Lộ trình tổng thể

| Giai đoạn | Việc | Thời gian ước tính |
|---|---|---|
| 1. Chuẩn bị code | Bước 0 (build, migration, push GitHub) | 0,5–1 buổi |
| 2. Mua dịch vụ | Domain theo `DOMAIN.md` + VPS (Bước 1) | 1 buổi (chờ khách cung cấp thông tin) |
| 3. Dựng server | Bước 2–6 (bảo mật, cài đặt, deploy, Nginx) | 0,5–1 ngày |
| 4. Trỏ DNS + SSL | Bước 7–8 | 30 phút thao tác + chờ DNS vài giờ |
| 5. Hoàn thiện | Bước 9 (admin, dữ liệu, email, test) | 0,5–1 ngày |
| 6. Vận hành | Bước 10 (backup) + bàn giao | 0,5 buổi |

Tổng: **~2–3 ngày làm việc** (chưa tính thời gian khách duyệt nội dung/ảnh thật).

---

## Bước 0 — Chuẩn bị code (làm tại máy local, TRƯỚC khi mua gì)

1. Build thử production, phải pass 100%:
   ```bash
   npm run build
   ```
2. Kiểm tra `package.json` có 2 dòng sau (đã thêm sẵn — thiếu `"type": "module"` thì lệnh `npx payload ...` sẽ lỗi `ERR_REQUIRE_ASYNC_MODULE` vì Payload 3 là ESM-only):
   ```json
   "type": "module",
   "engines": { "node": ">=20" },
   ```
3. **Tạo migration cho database** (quan trọng — `push: true` trong `payload.config.ts` chỉ hoạt động ở chế độ dev; trên production Payload BẮT BUỘC dùng migrations, nếu không DB sẽ không có bảng nào):
   ```bash
   npx payload migrate:create initial
   ```
   Lệnh này tạo file trong `src/migrations/` — commit thư mục này lên git.
4. Kiểm tra `.env` KHÔNG bị commit (đã có trong `.gitignore`), push code:
   ```bash
   git add -A && git commit -m "chuẩn bị deploy VPS" && git push origin main
   ```

## Bước 1 — Mua domain + VPS

### 1a. Domain

**→ Làm theo quy trình chi tiết trong `DOMAIN.md`**: đăng ký `.com` tại Mắt Bão, tài khoản + chủ thể đứng tên khách, kèm thủ tục **thông báo tên miền quốc tế** bắt buộc tại thongbaotenmien.vn. Chi phí: ~139–300k năm đầu, gia hạn ~350–400k/năm.

### 1b. VPS

Chọn 1 nhà cung cấp có datacenter tại VN — đều đáp ứng yêu cầu "máy chủ ở Việt Nam":

| Nhà cung cấp | Tham khảo | Ghi chú |
|---|---|---|
| Vietnix | https://vietnix.vn/vps/ | 2 vCPU/2GB từ ~159k/tháng, backup tuần |
| Mắt Bão | https://www.matbao.net | Tiện nếu domain cũng ở đây — quản lý 1 chỗ |
| AZDIGI | https://azdigi.com | So sánh giá 10 NCC: https://azdigi.com/blog/kien-thuc-vps/bang-gia-thue-vps-viet-nam |
| Viettel IDC / VNPT / FPT Cloud | — | Doanh nghiệp lớn, giá cao hơn, hợp nếu khách yêu cầu pháp nhân lớn |

**Cấu hình tối thiểu:** 2 vCPU / 2GB RAM / 40GB SSD / **Ubuntu 24.04 LTS** (~160–250k/tháng).
**Khuyến nghị:** 4GB RAM (~300–400k/tháng) — build Next.js nặng, 2GB bắt buộc thêm swap (Bước 2.6).

Sau khi mua, nhà cung cấp gửi email: **IP máy chủ + tài khoản root**. Ghi lại cẩn thận.

## Bước 2 — Thiết lập server ban đầu (bảo mật)

SSH vào server từ máy local (Windows: PowerShell):
```bash
ssh root@<IP-VPS>
```

1. Cập nhật hệ thống:
   ```bash
   apt update && apt upgrade -y
   ```
2. Tạo user riêng (không chạy app bằng root):
   ```bash
   adduser deploy
   usermod -aG sudo deploy
   ```
3. Cài SSH key cho user mới — chạy tại máy local (PowerShell):
   ```powershell
   ssh-keygen -t ed25519          # nếu chưa có key, Enter hết
   type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh deploy@<IP-VPS> "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
   ```
   Kiểm tra `ssh deploy@<IP-VPS>` vào được **không cần mật khẩu**, RỒI MỚI tắt đăng nhập mật khẩu:
   ```bash
   sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
   sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
   sudo systemctl restart ssh
   ```
4. Firewall — chỉ mở SSH + web:
   ```bash
   sudo apt install -y ufw
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
5. Chống dò mật khẩu SSH + tự vá lỗi bảo mật:
   ```bash
   sudo apt install -y fail2ban unattended-upgrades
   sudo systemctl enable --now fail2ban
   sudo dpkg-reconfigure -plow unattended-upgrades   # chọn Yes
   ```
6. Swap 2GB (bắt buộc nếu RAM 2GB, nên làm cả với 4GB):
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile && sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```
7. Múi giờ VN (log + cron backup đúng giờ):
   ```bash
   sudo timedatectl set-timezone Asia/Ho_Chi_Minh
   ```

Từ đây trở đi làm bằng user `deploy` (`ssh deploy@<IP-VPS>`).

## Bước 3 — Cài Node.js 22, PostgreSQL, Nginx

```bash
# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # phải ra v22.x

# PostgreSQL 16 (mặc định Ubuntu 24.04) — chỉ nghe localhost, an toàn
sudo apt install -y postgresql postgresql-contrib

# Nginx + PM2
sudo apt install -y nginx
sudo npm install -g pm2
```

## Bước 4 — Tạo database

```bash
sudo -u postgres psql
```
Trong psql (tự đặt mật khẩu mạnh thay `MAT_KHAU_DB`):
```sql
CREATE USER jobweb WITH PASSWORD 'MAT_KHAU_DB';
CREATE DATABASE jobweb OWNER jobweb;
\q
```
Connection string dùng ở Bước 5:
```
postgresql://jobweb:MAT_KHAU_DB@localhost:5432/jobweb
```

## Bước 5 — Deploy code

1. **Cho server quyền đọc repo GitHub** (repo private) — tạo deploy key trên server:
   ```bash
   ssh-keygen -t ed25519 -C "vps-jobweb" -f ~/.ssh/id_ed25519 -N ""
   cat ~/.ssh/id_ed25519.pub
   ```
   Copy output → GitHub repo `thphattt/JobWeb` → **Settings → Deploy keys → Add deploy key** (không cần write access).

2. Clone + cài dependencies:
   ```bash
   sudo mkdir -p /var/www && sudo chown deploy:deploy /var/www
   cd /var/www
   git clone git@github.com:thphattt/JobWeb.git jobweb
   cd jobweb
   npm ci
   ```

3. Tạo file `.env` trên server:
   ```bash
   nano /var/www/jobweb/.env
   ```
   ```env
   NODE_ENV=production
   DATABASE_URI=postgresql://jobweb:MAT_KHAU_DB@localhost:5432/jobweb
   PAYLOAD_SECRET=<chuỗi ngẫu nhiên - lệnh tạo ở dưới>
   NEXT_PUBLIC_SITE_URL=https://tanchauthanh.com
   RESEND_API_KEY=<API key từ https://resend.com>
   CONTACT_TO_EMAIL=tanchauthanhhn@gmail.com
   CONTACT_FROM_EMAIL="Tân Châu Thành <onboarding@resend.dev>"
   ```
   Tạo `PAYLOAD_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Chạy migration → build → khởi động bằng PM2:
   ```bash
   cd /var/www/jobweb
   npx payload migrate      # tạo bảng trong PostgreSQL
   npm run build
   pm2 start npm --name jobweb -- start
   pm2 save
   pm2 startup              # chạy lệnh sudo nó in ra → app tự chạy lại khi reboot
   ```
5. Kiểm tra app sống: `curl -I http://localhost:3000` phải trả `200`.

## Bước 6 — Nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/jobweb
```
```nginx
server {
    listen 80;
    server_name tanchauthanh.com www.tanchauthanh.com;

    client_max_body_size 25m;   # cho phép upload ảnh lớn qua /admin

    # Ảnh upload: Nginx phục vụ trực tiếp (nhanh + tránh giới hạn
    # "Next.js chỉ serve file có trong public/ lúc build")
    location /uploads/ {
        alias /var/www/jobweb/public/uploads/;
        expires 30d;
        access_log off;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/jobweb /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## Bước 7 — Trỏ DNS

Vào id.matbao.net → Quản lý tên miền → DNS (chi tiết trong `DOMAIN.md` Bước 5), thêm bản ghi:

| Loại | Tên | Giá trị |
|---|---|---|
| A | `@` | IP VPS |
| A (hoặc CNAME) | `www` | IP VPS (hoặc `tanchauthanh.com`) |

Chờ phân giải (vài phút–vài giờ), kiểm tra tại https://dnschecker.org. Thử `http://tanchauthanh.com` — thấy site (chưa có khóa) là DNS đã đúng.

## Bước 8 — SSL miễn phí (Let's Encrypt)

Chỉ làm SAU khi DNS đã trỏ đúng:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tanchauthanh.com -d www.tanchauthanh.com
```
Chọn redirect HTTP→HTTPS khi được hỏi. Certbot tự gia hạn (kiểm tra: `sudo certbot renew --dry-run`). Xong: `https://tanchauthanh.com` phải hiện khóa.

## Bước 9 — Thiết lập sau deploy

1. `https://tanchauthanh.com/admin` → tạo tài khoản admin đầu tiên (mật khẩu mạnh).
2. Nạp dữ liệu mẫu nếu cần (chạy từ máy local, PowerShell):
   ```powershell
   $env:SEED_BASE="https://tanchauthanh.com/api"; $env:SEED_EMAIL="<email admin>"; $env:SEED_PASSWORD="<mật khẩu>"; node scripts/seed.mjs
   ```
   (các script khác: `seed-hero-slides.mjs`, `seed-news.mjs`, `seed-projects.mjs`, `seed-p2.mjs`, `attach-images.mjs`)
3. **Email form liên hệ (Resend):** dashboard Resend → **Domains** → add `tanchauthanh.com` → thêm bản ghi SPF/DKIM vào DNS Mắt Bão → chờ verify → sửa `CONTACT_FROM_EMAIL="Tân Châu Thành <lienhe@tanchauthanh.com>"` trong `.env` → `pm2 restart jobweb`.
   *Lưu ý: Resend là dịch vụ nước ngoài (chỉ gửi email, không lưu dữ liệu web). Nếu khách yêu cầu tuyệt đối 100% VN, thay bằng SMTP của nhà cung cấp email VN — báo trước để đổi code gửi mail.*
4. Upload ảnh thật qua `/admin` → collection Media.
5. Test toàn bộ: 2 ngôn ngữ vi/en, dịch vụ/dự án/tin tức/tuyển dụng, form liên hệ, upload ảnh, mobile + desktop.

## Bước 10 — Backup tự động hằng đêm

```bash
sudo mkdir -p /var/backups/jobweb && sudo chown deploy:deploy /var/backups/jobweb
nano /home/deploy/backup.sh
```
```bash
#!/bin/bash
# Backup DB + ảnh upload, giữ 7 ngày gần nhất
# (dùng connection string, KHÔNG dùng sudo — cron không nhập được mật khẩu)
set -e
D=$(date +%F)
B=/var/backups/jobweb
pg_dump "postgresql://jobweb:MAT_KHAU_DB@localhost:5432/jobweb" | gzip > "$B/db-$D.sql.gz"
tar -czf "$B/uploads-$D.tar.gz" -C /var/www/jobweb/public uploads
find "$B" -type f -mtime +7 -delete
```
```bash
chmod +x /home/deploy/backup.sh
crontab -e
```
Thêm dòng (chạy 2h sáng mỗi ngày):
```
0 2 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```
Khuyến nghị thêm: mỗi tuần tải backup về máy local 1 lần (phòng VPS chết):
```powershell
scp deploy@<IP-VPS>:/var/backups/jobweb/db-*.sql.gz D:\Backup\
```

## Cập nhật code sau này (mỗi lần có thay đổi)

```bash
nano /home/deploy/deploy.sh
```
```bash
#!/bin/bash
set -e
cd /var/www/jobweb
git pull origin main
npm ci
npx payload migrate
npm run build
pm2 reload jobweb
```
```bash
chmod +x /home/deploy/deploy.sh
```
Từ đó mỗi lần cập nhật: push code lên GitHub → `ssh deploy@<IP-VPS>` → `./deploy.sh`.
Nếu có thay đổi schema CMS: chạy `npx payload migrate:create ten-thay-doi` ở local, commit trước khi push.

---

## Checklist bàn giao

- [ ] `npm run build` pass local, migrations đã commit
- [ ] Domain đăng ký xong theo `DOMAIN.md` (đứng tên khách, đã thông báo thongbaotenmien.vn)
- [ ] VPS active tại datacenter VN (chụp màn hình thông tin gói làm bằng chứng cho khách)
- [ ] Server đã harden: SSH key, tắt root/password login, ufw, fail2ban, swap, auto-update
- [ ] PostgreSQL local chạy, `npx payload migrate` thành công
- [ ] App chạy qua PM2, tự khởi động lại khi reboot (`pm2 startup` + `pm2 save`)
- [ ] Nginx + HTTPS hoạt động, redirect http→https
- [ ] Upload ảnh qua /admin OK, ảnh hiển thị qua `/uploads/...`
- [ ] Resend verify domain, form liên hệ nhận mail thật
- [ ] Cron backup chạy (kiểm tra file trong `/var/backups/jobweb` sáng hôm sau)
- [ ] Test vi/en trên mobile + desktop
- [ ] Bàn giao cho khách: tài khoản domain (Mắt Bão), IP + tài khoản VPS, tài khoản /admin, lịch gia hạn domain + VPS, file backup mẫu

## Chi phí ước tính năm đầu

| Khoản | Chi phí |
|---|---|
| Domain `.com` (theo `DOMAIN.md`) | ~139–300k năm đầu, gia hạn ~350–400k/năm |
| VPS 2 vCPU/2GB tại VN | ~1,9–3 triệu/năm (159–250k/tháng) |
| VPS 4GB (khuyến nghị) | ~3,6–4,8 triệu/năm |
| Resend | Free (3.000 email/tháng) |
| SSL Let's Encrypt | Free |
| **Tổng (2GB + .com)** | **~2,2–3,3 triệu đ/năm** |

Giá thay đổi thường xuyên — chốt theo trang giá nhà cung cấp tại thời điểm mua.

## Sự cố thường gặp

| Triệu chứng | Nguyên nhân / cách xử lý |
|---|---|
| `npx payload ...` lỗi `ERR_REQUIRE_ASYNC_MODULE` | `package.json` thiếu `"type": "module"` (Bước 0.2) |
| Build bị kill trên server | Thiếu RAM → tạo swap (Bước 2.6) hoặc nâng gói |
| `/admin` lỗi "relation does not exist" | Chưa chạy `npx payload migrate` |
| Upload ảnh lỗi 413 | Tăng `client_max_body_size` trong Nginx |
| Ảnh mới upload không hiển thị | Kiểm tra block `location /uploads/` trong Nginx |
| Site chết sau reboot VPS | Chưa chạy `pm2 startup` + `pm2 save` |
| Form không gửi mail | `RESEND_API_KEY` sai hoặc domain chưa verify; xem `pm2 logs jobweb` |
| Xem log app | `pm2 logs jobweb --lines 100` |
