"use client";

import { useEffect, useRef, useState } from "react";
import type { TodayResult } from "@/lib/picker";
import FoodManager from "./FoodManager";

const MEDALS = ["①", "②", "③"];

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
  const [display, setDisplay] = useState<string>(initial.food);
  const [spinning, setSpinning] = useState<boolean>(true);
  const [tick, setTick] = useState<number>(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const maxCount = Math.max(1, ...initial.ranking.map((r) => r.count));
  const pool = initial.pool.length > 0 ? initial.pool : [initial.food];

  function clearTimers() {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }

  function spin() {
    clearTimers();
    setSpinning(true);
    const duration = 1700;
    const start = Date.now();

    const step = () => {
      const elapsed = Date.now() - start;
      if (elapsed >= duration) {
        setDisplay(initial.food);
        setSpinning(false);
        setTick((t) => t + 1);
        return;
      }
      const random = pool[Math.floor(Math.random() * pool.length)];
      setDisplay(random);
      const delay = 70 + (elapsed / duration) * 190;
      timers.current.push(setTimeout(step, delay));
    };
    step();
  }

  useEffect(() => {
    spin();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-10 lg:justify-center lg:py-8">
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

        {/* 2 cột trên PC, dọc trên mobile */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
        {/* Card món hôm nay */}
        <section className="animate-fade [animation-delay:80ms]">
          <article className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_12px_30px_-18px_rgba(67,56,43,0.45)]">
            {/* Ảnh món với tông phim cũ */}
            <div className="relative h-56 w-full bg-cream sm:h-72">
              {initial.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={initial.image}
                  alt={initial.food}
                  className={`h-full w-full object-cover sepia-[0.25] saturate-[0.85] transition-all duration-700 ${
                    spinning ? "scale-105 blur-[2px] brightness-95" : "scale-100 blur-0"
                  }`}
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
                <span
                  key={`${display}-${tick}`}
                  className={`block font-serif text-3xl font-bold leading-tight text-ink sm:text-[2.6rem] ${
                    spinning ? "animate-spin-pop text-muted" : "animate-pop-in"
                  }`}
                >
                  {display}
                </span>
              </div>

              <p className="mt-2 h-5 font-serif text-sm italic text-muted">
                {spinning ? "đang chọn món…" : "Chốt đơn! Chúc ngon miệng."}
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

        {/* Cột phải: xếp hạng + lịch sử */}
        <div className="space-y-8">
        {/* Bảng xếp hạng tuần */}
        <section className="animate-fade [animation-delay:160ms]">
          <h2 className="mb-4 flex items-center justify-center gap-3 font-serif text-xl font-semibold text-ink">
            <span className="h-px w-6 bg-line" />
            Xếp hạng tuần này
            <span className="h-px w-6 bg-line" />
          </h2>
          {initial.ranking.length === 0 ? (
            <p className="rounded-xl border border-line bg-paper px-4 py-6 text-center text-sm italic text-muted">
              Chưa có dữ liệu tuần này.
            </p>
          ) : (
            <ul className="overflow-hidden rounded-xl border border-line bg-paper">
              {initial.ranking.map((r, i) => (
                <li
                  key={r.food}
                  className="relative flex items-center justify-between border-b border-line/70 px-4 py-3 last:border-b-0"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-sage/15"
                    style={{ width: `${(r.count / maxCount) * 100}%` }}
                  />
                  <span className="relative flex items-center gap-3">
                    <span className="w-6 text-center font-serif text-lg text-terracotta">
                      {MEDALS[i] ?? i + 1}
                    </span>
                    {r.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.image}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover sepia-[0.2] ring-1 ring-line"
                      />
                    ) : null}
                    <span className="font-medium text-ink">{r.food}</span>
                  </span>
                  <span className="relative font-serif text-sm font-semibold tabular-nums text-muted">
                    {r.count} lần
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Lịch sử 7 ngày */}
        <section className="animate-fade [animation-delay:240ms]">
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

        {/* Quản lý danh sách món (lưu Redis, cần mật khẩu để sửa) */}
        <FoodManager />
        </div>
        {/* hết cột phải */}
        </div>
        {/* hết grid 2 cột */}

        <div className="mx-auto mt-10 text-center font-serif text-lg text-line">❧</div>
      </div>
    </main>
  );
}
