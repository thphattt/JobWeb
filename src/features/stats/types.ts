export type StatsContent = {
  eyebrow?: string;
  title?: string;
  items?: { value?: number; suffix?: string; label?: string }[];
};

/** Một số liệu dùng cho component đếm số. */
export type StatItem = { value: number; suffix?: string; label: string };
