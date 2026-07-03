import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from 'lexical';
import { ArrowLeft, MapPin, Clock, CalendarDays, Mail, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { languageAlternates } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { getJobBySlug } from '@/features/careers/api';

function formatDate(date: string | undefined, locale: string): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  } catch {
    return '';
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = await getJobBySlug(slug, locale as Locale);
  if (!job) return {};
  const path = `/tuyen-dung/${slug}`;
  return {
    title: job.title,
    description: job.summary,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languageAlternates(path)
    },
    openGraph: { title: job.title, description: job.summary, url: `/${locale}${path}` }
  };
}

export default async function JobDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('careers');
  const tb = await getTranslations('brand');
  const job = await getJobBySlug(slug, locale as Locale);
  if (!job) notFound();

  const email = tb('email');
  const hotline = tb('hotline');

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Link
        href="/tuyen-dung"
        className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-accent transition-all hover:gap-2.5"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t('backToList')}
      </Link>

      <h1 className="mt-8 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl">
        {job.title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/60">
        {job.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 text-accent" aria-hidden />
            {job.location}
          </span>
        )}
        {job.type && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-accent" aria-hidden />
            {t(`types.${job.type}`)}
          </span>
        )}
        {job.deadline && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4 text-accent" aria-hidden />
            {t('deadline')}: {formatDate(job.deadline, locale)}
          </span>
        )}
      </div>

      {job.summary && (
        <p className="mt-8 text-lg leading-relaxed text-white/70">{job.summary}</p>
      )}

      {job.description ? (
        <div className="mt-6 max-w-none text-white/75 [&_a]:text-accent [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_p]:leading-relaxed [&_strong]:text-white [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
          <RichText data={job.description as SerializedEditorState} />
        </div>
      ) : null}

      {/* CTA ứng tuyển */}
      <div className="mt-10 border border-night-rule bg-night-2 p-6 sm:p-8">
        <p className="text-white/70">{t('applyHint')}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(`${t('apply')}: ${job.title}`)}`}
            className="inline-flex items-center gap-2 bg-brand-gradient px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            <Mail className="size-4" aria-hidden />
            {t('apply')}
          </a>
          <a
            href={`tel:${hotline.replace(/[.\s]/g, '')}`}
            className="inline-flex items-center gap-2 border-2 border-white/25 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:border-white/70"
          >
            <Phone className="size-4" aria-hidden />
            {hotline}
          </a>
        </div>
      </div>
    </article>
  );
}
