"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ACCOUNTANTS } from "@/lib/keToan";

export default function MoneyPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click ra ngoài / nhấn Esc thì đóng
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel sổ ra */}
      {open && (
        <div className="w-72 origin-bottom-right animate-pop-in overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_18px_40px_-16px_rgba(67,56,43,0.5)]">
          {/* Header */}
          <div className="border-b border-line/70 bg-cream/50 px-4 py-3">
            <p className="font-serif text-base font-semibold text-ink">💰 Sổ tiền ăn</p>
            <p className="mt-0.5 text-xs italic text-muted">Chọn kế toán để xem chi tiết</p>
          </div>

          {/* 2 tab kế toán */}
          <div className="p-2">
            {ACCOUNTANTS.map((a, i) => (
              <Link
                key={a.slug}
                href={`/ke-toan/${a.slug}`}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-cream"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta/12 font-serif text-sm font-semibold text-terracotta">
                    {i + 1}
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-sm font-medium text-ink">KT: {a.name}</span>
                    <span className="text-xs text-muted">Xem sổ chi tiết</span>
                  </span>
                </span>
                <span className="text-muted transition-transform group-hover:translate-x-0.5">›</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Nút nổi */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Sổ tiền ăn"
        className={`flex h-14 w-14 items-center justify-center rounded-full border border-terracotta/30 bg-terracotta text-2xl text-paper shadow-[0_10px_24px_-8px_rgba(181,101,75,0.7)] transition-all hover:bg-[#a25842] active:scale-95 ${
          open ? "rotate-12" : ""
        }`}
      >
        {open ? "✕" : "💵"}
      </button>
    </div>
  );
}
