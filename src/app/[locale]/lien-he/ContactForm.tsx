'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';
import { submitContact, type ContactState } from './actions';

const initial: ContactState = { status: 'idle' };

const inputCls =
  'mt-1 w-full border border-night-rule bg-night px-3 py-2 text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent';

export function ContactForm() {
  const t = useTranslations('form');
  const [state, action, pending] = useActionState(submitContact, initial);
  const hasErr = (f: string) =>
    state.status === 'error' && (state.fields?.includes(f) ?? false);

  return (
    <form action={action} className="space-y-4" noValidate>
      {/* Honeypot chống bot: ẩn khỏi người dùng & trình đọc màn hình. Bỏ trống. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-medium text-white">
          {t('name')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder={t('namePlaceholder')}
          className={inputCls}
        />
        {hasErr('name') && (
          <p className="mt-1 text-sm text-red-400">{t('errName')}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact" className="text-sm font-medium text-white">
          {t('contact')}
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          placeholder={t('contactPlaceholder')}
          className={inputCls}
        />
        {hasErr('contact') && (
          <p className="mt-1 text-sm text-red-400">{t('errContact')}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-white">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={t('messagePlaceholder')}
          className={inputCls}
        />
        {hasErr('message') && (
          <p className="mt-1 text-sm text-red-400">{t('errMessage')}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 bg-brand-gradient px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-accent-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden />
        {pending ? t('sending') : t('submit')}
      </button>

      {state.status === 'success' && (
        <p className="text-sm font-medium text-green-400">{t('success')}</p>
      )}
      {state.status === 'error' && !state.fields && (
        <p className="text-sm font-medium text-red-400">{t('error')}</p>
      )}
    </form>
  );
}