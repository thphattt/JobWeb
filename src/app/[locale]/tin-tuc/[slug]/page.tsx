import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from 'lexical';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { languageAlternates } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { getNewsBySlug } from '@/features/news/api';

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
  const post = await getNewsBySlug(slug, locale as Locale);
  if (!post) return {};
  const path = `/tin-tuc/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languageAlternates(path)
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/${locale}${path}`,
      images: post.coverImage?.url ? [{ url: post.coverImage.url }] : undefined
    }
  };
}

export default async function NewsDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');
  const post = await getNewsBySlug(slug, locale as Locale);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Link
        href="/tin-tuc"
        className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-accent transition-all hover:gap-2.5"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t('backToList')}
      </Link>

      <time className="mt-8 block text-xs font-semibold uppercase tracking-wide text-accent">
        {formatDate(post.date, locale)}
      </time>
      <h1 className="mt-2 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl">
        {post.title}
      </h1>

      {post.coverImage?.url && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-card border border-night-rule">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {post.excerpt && (
        <p className="mt-8 text-lg leading-relaxed text-white/70">{post.excerpt}</p>
      )}

      {post.content ? (
        <div className="mt-6 max-w-none text-white/75 [&_a]:text-accent [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_p]:leading-relaxed [&_strong]:text-white [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
          <RichText data={post.content as SerializedEditorState} />
        </div>
      ) : null}
    </article>
  );
}
