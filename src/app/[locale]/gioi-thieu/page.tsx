import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle2 } from 'lucide-react';
import { languageAlternates } from '@/lib/site';

const leaders = ['director', 'deputy', 'accountant', 'advisor'] as const;
const programs = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] as const;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = '/gioi-thieu';
  return {
    title: t('about.title'),
    description: t('about.description'),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languageAlternates(path)
    },
    openGraph: {
      title: t('about.title'),
      description: t('about.description'),
      url: `/${locale}${path}`
    }
  };
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('aboutPage');

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-8 bg-accent" aria-hidden />
        {t('eyebrow')}
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-2">{t('lead')}</p>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold text-ink">
          {t('leadershipTitle')}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {leaders.map((k) => (
            <div
              key={k}
              className="rounded-card border border-rule bg-paper p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {t(`leaders.${k}.role`)}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-ink">
                {t(`leaders.${k}.name`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold text-ink">
          {t('programsTitle')}
        </h2>
        <ul className="mt-6 space-y-3">
          {programs.map((k) => (
            <li key={k} className="flex gap-3 text-ink-2">
              <CheckCircle2
                className="mt-0.5 size-5 shrink-0 text-accent"
                aria-hidden
              />
              <span>{t(`programs.${k}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-card bg-ink p-8 sm:p-10">
        <h2 className="font-display text-2xl font-bold text-paper">
          {t('collaboratorsTitle')}
        </h2>
        <p className="mt-4 text-paper/70">{t('collaborators')}</p>
      </section>
    </div>
  );
}