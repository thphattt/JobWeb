import { useTranslations } from 'next-intl';
import { Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const offices = [
  { labelKey: 'hqLabel', addr: '26 Trần Quốc Toản, P. Cửa Nam, Hà Nội' },
  { labelKey: 'office2Label', addr: '44 ngõ 36a Trần Điền, P. Phương Liệt, Hà Nội' }
] as const;

const phones = ['0243.822.9251', '091.353.2566', '091.949.6886'];

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
            <a
              href="#"
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-pill border border-rule text-ink-2 transition-colors hover:border-accent hover:text-accent"
            >
              <Facebook className="size-4" aria-hidden />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="flex size-9 items-center justify-center rounded-pill border border-rule text-ink-2 transition-colors hover:border-accent hover:text-accent"
            >
              <Youtube className="size-4" aria-hidden />
            </a>
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