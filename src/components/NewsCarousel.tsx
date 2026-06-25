'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsCard, type NewsCardPost } from './NewsCard';

/** Carousel tin tức (Embla) — trượt nhiều thẻ, 1/2/3 thẻ mỗi khung theo màn hình. */
export function NewsCarousel({
  posts,
  locale,
  readMore,
  prevLabel,
  nextLabel,
  showControls = true
}: {
  posts: NewsCardPost[];
  locale: string;
  readMore: string;
  prevLabel: string;
  nextLabel: string;
  /** Ẩn nút ◀ ▶ (vẫn vuốt được) — dùng cho teaser ở trang chủ. */
  showControls?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    containScroll: 'trimSnaps'
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-stretch">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex min-w-0 flex-[0_0_100%] pr-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <NewsCard post={post} locale={locale} readMore={readMore} />
            </div>
          ))}
        </div>
      </div>

      {showControls && posts.length > 1 && (
        <div className="mt-8 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label={prevLabel}
            className="flex size-11 cursor-pointer items-center justify-center border-2 border-white/25 text-white transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-30 disabled:hover:border-white/25 disabled:hover:text-white hover:cursor-pointer"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label={nextLabel}
            className="flex size-11 cursor-pointer items-center justify-center bg-brand-gradient text-accent-ink transition-transform hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-30 hover:cursor-pointer"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
