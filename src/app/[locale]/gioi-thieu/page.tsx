import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { languageAlternates } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { getCollaborators } from '@/lib/content';
import { EventGallery } from '@/components/EventGallery';
import { CollaboratorGrid } from '@/components/CollaboratorGrid';

const leaders = ['director', 'deputy', 'accountant', 'advisor'] as const;

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
  const collaborators = await getCollaborators(locale as Locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-8 bg-accent" aria-hidden />
        {t('eyebrow')}
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-white/60">{t('lead')}</p>

      <section className="mt-16">
        <h2 className="flex items-center gap-3 font-display text-2xl font-bold uppercase text-white">
          <span className="size-6 shrink-0 bg-brand-gradient" aria-hidden />
          {t('leadershipTitle')}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {leaders.map((k) => (
            <div key={k} className="border border-night-rule bg-night-2 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {t(`leaders.${k}.role`)}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-white">
                {t(`leaders.${k}.name`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="flex items-center gap-3 font-display text-2xl font-bold uppercase text-white">
          <span className="size-6 shrink-0 bg-brand-gradient" aria-hidden />
          {t('programsTitle')}
        </h2>
        <div className="mt-6">
          <EventGallery />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="flex items-center gap-3 font-display text-2xl font-bold uppercase text-white">
          <span className="size-6 shrink-0 bg-brand-gradient" aria-hidden />
          {t('collaboratorsTitle')}
        </h2>
        <p className="mt-4 max-w-3xl text-white/65">{t('collaborators')}</p>
        {collaborators.length > 0 && (
          <div className="mt-8">
            <CollaboratorGrid items={collaborators} />
          </div>
        )}
      </section>
    </div>
  );
}