import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Phone, Mail, MapPin } from 'lucide-react';
import { languageAlternates } from '@/lib/site';
import { ContactForm } from './ContactForm';

const offices = [
  { labelKey: 'hqLabel', addr: '26 Trần Quốc Toản, P. Cửa Nam, Hà Nội' },
  { labelKey: 'office2Label', addr: '44 ngõ 36a Trần Điền, P. Phương Liệt, Hà Nội' }
] as const;

const phones = ['0243.822.9251', '091.353.2566', '091.949.6886'];

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = '/lien-he';
  return {
    title: t('contact.title'),
    description: t('contact.description'),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languageAlternates(path)
    },
    openGraph: {
      title: t('contact.title'),
      description: t('contact.description'),
      url: `/${locale}${path}`
    }
  };
}

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const email = t('brand.email');

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-8 bg-accent" aria-hidden />
        {t('contactPage.eyebrow')}
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        {t('contactPage.title')}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-2">
        {t('contactPage.lead')}
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* Thông tin liên hệ */}
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            {t('contactPage.infoTitle')}
          </h2>

          <div className="mt-6 space-y-6 text-sm">
            <div>
              <p className="font-semibold uppercase tracking-wide text-accent">
                {t('contactPage.officesLabel')}
              </p>
              <ul className="mt-3 space-y-3 text-ink-2">
                {offices.map((o) => (
                  <li key={o.labelKey} className="flex gap-2">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span>
                      <span className="font-medium text-ink">
                        {t(`footer.${o.labelKey}`)}
                      </span>
                      <br />
                      {o.addr}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wide text-accent">
                {t('contactPage.phoneLabel')}
              </p>
              <ul className="mt-3 space-y-2 text-ink-2">
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
              </ul>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wide text-accent">
                {t('contactPage.emailLabel')}
              </p>
              <a
                href={`mailto:${email}`}
                className="mt-3 inline-flex items-center gap-2 text-ink-2 transition-colors hover:text-ink"
              >
                <Mail className="size-4 shrink-0 text-accent" aria-hidden />
                {email}
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-card border border-rule bg-paper p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-ink">
            {t('form.title')}
          </h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Bản đồ — vị trí 2 văn phòng (Google Maps embed, không cần API key) */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold text-ink">
          {t('contactPage.mapTitle')}
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {offices.map((o) => (
            <div
              key={o.labelKey}
              className="overflow-hidden rounded-card border border-rule"
            >
              <iframe
                title={`${t(`footer.${o.labelKey}`)} — ${o.addr}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  o.addr
                )}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-64 w-full border-0"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}