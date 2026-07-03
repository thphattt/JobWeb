export type EventItem = {
  /** Trùng key trong messages (events.items.<id>) và tên file ảnh gợi ý. */
  id: string;
  /** Ảnh thật (tuỳ chọn): thả vào public/events/ rồi điền '/events/xxx.jpg'. */
  image?: string;
};

/** Fallback khi CMS chưa có dữ liệu projects (khớp key messages.events.items). */
export const events: EventItem[] = [
  { id: 'seaGames22' },
  { id: 'thangLong1000' },
  { id: 'toQuoc2015' },
  { id: 'thuDo10' },
  { id: 'denHung2019' },
  { id: 'daiHoiDang' }
];
