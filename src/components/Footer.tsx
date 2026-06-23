import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail } from 'lucide-react';

const officeLabelKeys = ['hqLabel', 'office2Label'] as const;
const defaultOffices = [
  '26 Trần Quốc Toản, P. Cửa Nam, Hà Nội',
  '44 ngõ 36a Trần Điền, P. Phương Liệt, Hà Nội'
];
const defaultPhones = ['0243.822.9251', '091.353.2566', '091.949.6886'];
const defaultFacebook = 'https://www.facebook.com/TanChauThanhhn/';

/** Nội dung liên hệ từ CMS (Payload). Thiếu trường nào thì dùng mặc định. */
export type FooterData = {
  brandName?: string;
  tagline?: string;
  offices?: string[];
  phones?: string[];
  email?: string;
  facebook?: string;
};

// Icon thương hiệu vẽ inline (lucide đã deprecate các icon mạng xã hội).
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796v8.437C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

export function Footer({ data }: { data?: FooterData }) {
  const t = useTranslations('footer');
  const tb = useTranslations('brand');
  const year = new Date().getFullYear();

  const brandName = data?.brandName || tb('fullName');
  const tagline = data?.tagline || t('tagline');
  const email = data?.email || tb('email');
  const facebook = data?.facebook || defaultFacebook;
  const offices = data?.offices?.length ? data.offices : defaultOffices;
  const phones = data?.phones?.length ? data.phones : defaultPhones;

  return (
    <footer className="border-t border-night-rule bg-night">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="font-display text-xl font-extrabold text-white">
            {brandName}
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/60">{tagline}</p>
          <div className="mt-5 flex gap-3">
            <a
              href={facebook}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 items-center justify-center rounded-pill border border-night-rule text-white/60 transition-colors hover:border-accent hover:text-accent"
            >
              <FacebookIcon className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t('offices')}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            {offices.map((addr, i) => (
              <li key={addr} className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-medium text-white">
                    {t(officeLabelKeys[i] ?? 'office2Label')}
                  </span>
                  <br />
                  {addr}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t('contactTitle')}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            {phones.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-accent" aria-hidden />
                <a
                  href={`tel:${p.replace(/[.\s]/g, '')}`}
                  className="transition-colors hover:text-white"
                >
                  {p}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-accent" aria-hidden />
              <a
                href={`mailto:${email}`}
                className="break-all transition-colors hover:text-white"
              >
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-brand-gradient">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs font-medium text-white sm:px-6 lg:px-8">
          {t('rights', { year })}
        </div>
      </div>
    </footer>
  );
}