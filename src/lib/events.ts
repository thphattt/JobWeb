export type EventItem = {
  /** Trùng key trong messages (events.items.<id>) và tên file ảnh gợi ý. */
  id: string;
  /**
   * Ảnh thật của sự kiện (tuỳ chọn). Thả file vào public/events/ rồi điền
   * đường dẫn, vd: image: '/events/sea-games-22.jpg'. Chưa có ảnh thì
   * EventGallery tự hiển thị ô gradient thương hiệu + năm.
   */
  image?: string;
};

export const events: EventItem[] = [
  { id: 'seaGames22' },
  { id: 'thangLong1000' },
  { id: 'toQuoc2015' },
  { id: 'thuDo10' },
  { id: 'denHung2019' },
  { id: 'daiHoiDang' }
];