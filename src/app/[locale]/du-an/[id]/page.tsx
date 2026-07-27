import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from 'lexical';
import { ArrowLeft, MapPin, CalendarDays } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { languageAlternates } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { getProjectById } from '@/features/projects/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const project = await getProjectById(Number(id), locale as Locale);
  if (!project) return {};
  const path = `/du-an/${id}`;
  return {
    title: project.title,
    description: project.venue,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languageAlternates(path)
    },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.venue,
      url: `/${locale}${path}`,
      images: project.image?.url ? [{ url: project.image.url }] : undefined
    }
  };
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('events');

  const numId = Number(id);
  const project = Number.isFinite(numId)
    ? await getProjectById(numId, locale as Locale)
    : null;
  if (!project) notFound();

  const album = (project.gallery ?? [])
    .map((g) => g.image?.url)
    .filter((u): u is string => Boolean(u));

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-accent transition-all hover:gap-2.5"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t('detailBack')}
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wide text-accent">
        {project.role && <span>{t(`roles.${project.role}`)}</span>}
        {project.year && (
          <span className="inline-flex items-center gap-1.5 text-white/60">
            <CalendarDays className="size-4 text-accent" aria-hidden />
            {project.year}
          </span>
        )}
      </div>

      <h1 className="mt-2 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl">
        {project.title}
      </h1>

      {project.venue && (
        <p className="mt-3 inline-flex items-start gap-2 text-lg text-white/70">
          <MapPin className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
          {project.venue}
        </p>
      )}

      {project.image?.url && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-card border border-night-rule">
          <Image
            src={project.image.url}
            alt={project.image.alt || project.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {project.description ? (
        <div className="mt-8 max-w-none text-white/75 [&_a]:text-accent [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_p]:leading-relaxed [&_strong]:text-white [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
          <RichText data={project.description as SerializedEditorState} />
        </div>
      ) : null}

      {album.length > 0 && (
        <section className="mt-12">
          <h2 className="flex items-center gap-3 font-display text-xl font-bold uppercase text-white">
            <span className="size-5 shrink-0 bg-brand-gradient" aria-hidden />
            {t('photos')}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {album.map((src, i) => (
              <div
                key={i}
                className="relative aspect-4/3 overflow-hidden rounded-card border border-night-rule"
              >
                <Image
                  src={src}
                  alt={`${project.title} — ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
