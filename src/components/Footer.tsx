import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail } from 'lucide-react';

const offices = [
  { labelKey: 'hqLabel', addr: '26 Trần Quốc Toản, P. Cửa Nam, Hà Nội' },
  { labelKey: 'office2Label', addr: '44 ngõ 36a Trần Điền, P. Phương Liệt, Hà Nội' }
] as const;

const phones = ['0243.822.9251', '091.353.2566', '091.949.6886'];

// Icon thương hiệu vẽ inline (lucide đã deprecate các icon mạng xã hội).
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796v8.437C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

// Chỉ render icon mạng xã hội có URL thật (thêm YouTube… khi có kênh).
const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/TanChauThanhhn/',
    Icon: FacebookIcon
  }
] as const;

export function Footer() {
  const t = useTranslations('footer');
  const tb = useTranslations('brand');
  const year = new Date().getFullYear();
  const email = tb('email');

  return (
    <footer className="mt-24 border-t border-rule bg-paper-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="font-display text-xl font-extrabold text-ink">
            {tb('fullName')}
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-2">{t('tagline')}</p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-pill border border-rule text-ink-2 transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
            {t('offices')}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-2">
            {offices.map((o) => (
              <li key={o.labelKey} className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-medium text-ink">{t(o.labelKey)}</span>
                  <br />
                  {o.addr}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
            {t('contactTitle')}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-2">
            {phones.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-accent" aria-hidden />
                <a
                  href={`tel:${p.replace(/[.\s]/g, '')}`}
                  className="transition-colors hover:text-ink"
                >
                  {p}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-accent" aria-hidden />
              <a
                href={`mailto:${email}`}
                className="break-all transition-colors hover:text-ink"
              >
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-ink-2 sm:px-6 lg:px-8">
          {t('rights', { year })}
        </div>
      </div>
    </footer>
  );
}