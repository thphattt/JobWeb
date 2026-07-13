'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { NewsCardPost } from '../types';
import { NewsCard } from './NewsCard';

/**
 * Phân trang tin tức phía client (không tải lại trang) — dùng cho mục tin ở trang chủ.
 * Mặc định 3 bài/trang; nút Trước/Sau chỉ icon mũi tên + số trang.
 */
export function NewsPager({
  posts,
  locale,
  readMore,
  prevLabel,
  nextLabel,
  perPage = 3
}: {
  posts: NewsCardPost[];
  locale: string;
  readMore: string;
  prevLabel: string;
  nextLabel: string;
  perPage?: number;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * perPage;
  const visible = posts.slice(start, start + perPage);

  const arrowBase =
    'inline-flex size-10 items-center justify-center border transition-colors';

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <NewsCard key={post.id} post={post} locale={locale} readMore={readMore} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          aria-label={nextLabel}
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current <= 1}
            aria-label={prevLabel}
            className={`${arrowBase} border-night-rule bg-night-2 text-white/70 hover:border-accent hover:text-accent disabled:cursor-default disabled:border-night-rule disabled:text-white/20 disabled:hover:border-night-rule disabled:hover:text-white/20 ${
              current <= 1 ? '' : 'cursor-pointer'
            }`}
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === current ? 'page' : undefined}
              className={`inline-flex size-10 cursor-pointer items-center justify-center border text-sm font-bold transition-colors ${
                n === current
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-night-rule bg-night-2 text-white/70 hover:border-accent hover:text-accent'
              }`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current >= totalPages}
            aria-label={nextLabel}
            className={`${arrowBase} border-night-rule bg-night-2 text-white/70 hover:border-accent hover:text-accent disabled:cursor-default disabled:border-night-rule disabled:text-white/20 disabled:hover:border-night-rule disabled:hover:text-white/20 ${
              current >= totalPages ? '' : 'cursor-pointer'
            }`}
          >
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </nav>
      )}
    </div>
  );
}
