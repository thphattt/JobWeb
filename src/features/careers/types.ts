export type JobDoc = {
  id: number;
  title: string;
  slug: string;
  location?: string;
  type?: 'fulltime' | 'parttime' | 'contract';
  deadline?: string;
  summary?: string;
  /** Lexical richtext — render bằng <RichText/>. */
  description?: unknown;
  published?: boolean;
};
