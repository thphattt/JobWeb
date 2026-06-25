import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { MediaRef } from '@/lib/content';

/** Dữ liệu tối thiểu để render thẻ tin (an toàn truyền qua client/carousel). */
export type NewsCardPost = {
  id: number;
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  coverImage?: MediaRef;
};

function formatDate(date: string | undefined, locale: string): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  } catch {
    return '';
  }
}

/** Thẻ tin tức — ảnh bìa, ngày, tiêu đề, tóm tắt; bấm sang trang chi tiết. */
export function NewsCard({
  post,
  locale,
  readMore
}: {
  post: NewsCardPost;
  locale: string;
  readMore: string;
}) {
  const cover = post.coverImage?.url;
  return (
    <article className="group flex h-full w-full flex-col border border-night-rule bg-night-2 transition-colors hover:border-accent">
      <Link href={`/tin-tuc/${post.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={post.coverImage?.alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-gradient opacity-90" />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <time className="text-xs font-semibold uppercase tracking-wide text-accent">
          {formatDate(post.date, locale)}
        </time>
        <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug text-white">
          <Link
            href={`/tin-tuc/${post.slug}`}
            className="transition-colors hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-white/55">{post.excerpt}</p>
        )}
        <Link
          href={`/tin-tuc/${post.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold uppercase tracking-wide text-accent transition-all hover:gap-2.5"
        >
          {readMore}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
