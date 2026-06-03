import type { TodayResult } from "@/lib/picker";
import FoodManager from "./FoodManager";

function formatDate(d: string): string {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

const WEEKDAYS = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

function weekdayOf(d: string): string {
  const [y, m, day] = d.split("-").map(Number);
  const idx = new Date(Date.UTC(y, m - 1, day)).getUTCDay();
  return WEEKDAYS[idx];
}

export default function FoodClient({ initial }: { initial: TodayResult }) {
  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-10 lg:justify-center lg:py-8">
        {/* Header */}
        <header className="animate-fade text-center">
          <p className="font-serif text-sm italic tracking-wide text-terracotta">
            {weekdayOf(initial.date)}, {formatDate(initial.date)}
          </p>
          <div className="mx-auto mt-3 flex items-center justify-center gap-3 text-muted">
            <span className="h-px w-10 bg-line" />
            <span className="text-xs uppercase tracking-[0.3em]">Thực đơn</span>
            <span className="h-px w-10 bg-line" />
          </div>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-5xl">
            Hôm nay ăn gì?
          </h1>
        </header>

        {/* 3 cột trên PC, dọc trên mobile */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start lg:gap-7">
        {/* Cột trái: Danh sách món */}
        <FoodManager />

        {/* Cột giữa: Card món hôm nay */}
        <section className="animate-fade [animation-delay:80ms] lg:sticky lg:top-8">
          <article className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_12px_30px_-18px_rgba(67,56,43,0.45)]">
            {/* Ảnh món với tông phim cũ */}
            <div className="relative h-56 w-full bg-cream sm:h-72">
              {initial.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={initial.image}
                  alt={initial.food}
                  className="h-full w-full object-cover sepia-[0.25] saturate-[0.85]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl opacity-60">
                  🍽️
                </div>
              )}
              {/* viền giấy mép trong */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
              <span className="absolute left-4 top-4 rounded-full border border-ink/15 bg-paper/85 px-3 py-1 font-serif text-[11px] uppercase tracking-[0.2em] text-terracotta backdrop-blur-sm">
                Món hôm nay
              </span>
            </div>

            {/* Tên món */}
            <div className="px-6 py-7 text-center sm:px-8">
              <div className="flex min-h-[3.5rem] items-center justify-center">
                <span className="block font-serif text-3xl font-bold leading-tight text-ink sm:text-[2.6rem]">
                  {initial.food}
                </span>
              </div>

              <p className="mt-2 h-5 font-serif text-sm italic text-muted">
                Chốt đơn! Chúc ngon miệng.
              </p>

              <div className="mt-5 flex items-center justify-center gap-3 text-mustard">
                <span className="h-px w-8 bg-line" />
                <span className="text-xs">✦</span>
                <span className="h-px w-8 bg-line" />
              </div>
              <p className="mt-3 font-serif text-xs italic text-muted/80">
                Mỗi ngày một món — hẹn gặp lại vào ngày mai.
              </p>
            </div>
          </article>
        </section>

        {/* Cột phải: lịch sử 7 ngày */}
        <section className="animate-fade [animation-delay:160ms]">
          <h2 className="mb-4 flex items-center justify-center gap-3 font-serif text-xl font-semibold text-ink">
            <span className="h-px w-6 bg-line" />
            7 ngày gần nhất
            <span className="h-px w-6 bg-line" />
          </h2>
          {initial.history.length === 0 ? (
            <p className="rounded-xl border border-line bg-paper px-4 py-6 text-center text-sm italic text-muted">
              Chưa có lịch sử.
            </p>
          ) : (
            <ul className="overflow-hidden rounded-xl border border-line bg-paper">
              {initial.history.map((h) => (
                <li
                  key={h.date}
                  className="flex items-center justify-between border-b border-line/70 px-4 py-3 last:border-b-0"
                >
                  <span className="flex items-center gap-3">
                    {h.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={h.image}
                        alt=""
                        className="h-9 w-9 rounded-md object-cover sepia-[0.2] ring-1 ring-line"
                      />
                    ) : null}
                    <span className="flex flex-col leading-tight">
                      <span className="text-sm font-medium text-ink">
                        {weekdayOf(h.date)}
                      </span>
                      <span className="text-xs text-muted">{formatDate(h.date)}</span>
                    </span>
                  </span>
                  <span className="font-medium text-ink">{h.food}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        {/* hết grid 3 cột */}
        </div>

        <div className="mx-auto mt-10 text-center font-serif text-lg text-line">❧</div>
      </div>
    </main>
  );
}
