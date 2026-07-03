import 'server-only';
import { payloadClient, safe } from '@/lib/payload';
import type { Locale } from '@/i18n/routing';
import type { TestimonialDoc, ClientDoc } from './types';

export const getTestimonials = (locale: Locale) =>
  safe<TestimonialDoc[]>(
    'getTestimonials',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'testimonials',
        locale,
        sort: 'order',
        limit: 100,
        depth: 1
      });
      return r.docs as TestimonialDoc[];
    },
    []
  );

export const getClients = (locale: Locale) =>
  safe<ClientDoc[]>(
    'getClients',
    async () => {
      const p = await payloadClient();
      const r = await p.find({
        collection: 'clients',
        locale,
        sort: 'order',
        limit: 100,
        depth: 1
      });
      return r.docs as ClientDoc[];
    },
    []
  );
