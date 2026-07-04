export type EventItem = {
  /** Trùng key trong messages (events.items.<id>) và tên file ảnh gợi ý. */
  id: string;
  /** Ảnh thật (tuỳ chọn): thả vào public/events/ rồi điền '/events/xxx.jpg'. */
  image?: string;
};

/** Fallback khi CMS chưa có dữ liệu projects (khớp key messages.events.items). */
export const events: EventItem[] = [
  { id: 'seaGames22', image: '/events/sea-games-22.jpg' },
  { id: 'thangLong1000', image: '/events/thang-long-1000.jpg' },
  { id: 'toQuoc2015', image: '/events/to-quoc-2015.jpg' },
  { id: 'thuDo10', image: '/events/thu-do-10.jpg' },
  { id: 'denHung2019', image: '/events/den-hung-2019.jpg' },
  { id: 'daiHoiDang', image: '/events/dai-hoi-dang.jpg' }
];
