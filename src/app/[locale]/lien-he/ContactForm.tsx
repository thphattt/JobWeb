'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';
import { submitContact, type ContactState } from './actions';

const initial: ContactState = { status: 'idle' };

const inputCls =
  'mt-1 w-full rounded-input border border-rule bg-paper px-3 py-2 text-ink outline-none transition-colors focus:border-accent';

export function ContactForm() {
  const t = useTranslations('form');
  const [state, action, pending] = useActionState(submitContact, initial);
  const hasErr = (f: string) =>
    state.status === 'error' && (state.fields?.includes(f) ?? false);

  return (
    <form action={action} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="text-sm font-medium text-ink">
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
          <p className="mt-1 text-sm text-red-600">{t('errName')}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact" className="text-sm font-medium text-ink">
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
          <p className="mt-1 text-sm text-red-600">{t('errContact')}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink">
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
          <p className="mt-1 text-sm text-red-600">{t('errMessage')}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-pill bg-brand-gradient px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden />
        {pending ? t('sending') : t('submit')}
      </button>

      {state.status === 'success' && (
        <p className="text-sm font-medium text-green-700">{t('success')}</p>
      )}
      {state.status === 'error' && !state.fields && (
        <p className="text-sm font-medium text-red-600">{t('error')}</p>
      )}
    </form>
  );
}