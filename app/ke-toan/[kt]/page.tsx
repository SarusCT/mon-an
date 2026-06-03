import Link from "next/link";
import { notFound } from "next/navigation";
import { ACCOUNTANTS, getAccountant, getRows, totalOf, formatVND } from "@/lib/keToan";

export const revalidate = 60;

// Tạo sẵn các trang cho 2 kế toán
export function generateStaticParams() {
  return ACCOUNTANTS.map((a) => ({ kt: a.slug }));
}

// Chữ cái đại diện — lấy từ từ cuối cùng (vd "a Hưng" → H)
function initialOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1] || name;
  return last.charAt(0).toUpperCase();
}

export default async function KeToanPage({ params }: { params: { kt: string } }) {
  const acc = getAccountant(params.kt);
  if (!acc) notFound();

  const rows = await getRows(acc.slug);
  const total = totalOf(rows);
  const maxAbs = Math.max(1, ...rows.map((r) => Math.abs(r.sum)));

  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-10 lg:py-14">
        {/* Quay lại */}
        <Link
          href="/"
          className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-terracotta"
        >
          ‹ Về trang chính
        </Link>

        {/* 2 cột trên PC: trái = tổng quan, phải = chi tiết */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:items-start">
          {/* Cột trái: avatar + tổng (sticky) */}
          <aside className="animate-fade lg:sticky lg:top-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-terracotta/25 bg-terracotta/10 font-serif text-2xl font-bold text-terracotta shadow-[0_8px_20px_-12px_rgba(181,101,75,0.6)]">
                {initialOf(acc.name)}
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-muted">
                Sổ tiền ăn · Kế toán
              </p>
              <h1 className="mt-1 font-serif text-4xl font-bold text-ink">{acc.name}</h1>
            </div>

            {/* Card tổng tiền */}
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-paper to-cream/60 px-6 py-8 text-center shadow-[0_14px_34px_-18px_rgba(67,56,43,0.5)]">
              <span className="pointer-events-none absolute -right-6 -top-6 text-7xl opacity-[0.07]">
                💰
              </span>
              <p className="text-xs uppercase tracking-[0.25em] text-muted">Tổng cộng</p>
              <p
                className={`mt-2 font-serif text-[2.7rem] font-bold leading-none tabular-nums ${
                  total < 0 ? "text-terracotta" : "text-ink"
                }`}
              >
                {formatVND(total)}
              </p>
              <div className="mt-4 flex items-center justify-center gap-3 text-mustard">
                <span className="h-px w-8 bg-line" />
                <span className="text-xs">✦</span>
                <span className="h-px w-8 bg-line" />
              </div>
              <p className="mt-3 text-sm italic text-muted">{rows.length} thành viên</p>
            </div>

            {/* Chú thích màu */}
            {rows.length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-5 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sage/60" /> dương
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-dusty/60" /> âm
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-line" /> bằng 0
                </span>
              </div>
            )}
          </aside>

          {/* Cột phải: danh sách chi tiết */}
          <section className="animate-fade [animation-delay:120ms]">
            <h2 className="mb-4 flex items-center justify-center gap-3 font-serif text-xl font-semibold text-ink lg:justify-start">
              <span className="h-px w-6 bg-line" />
              Chi tiết từng người
              <span className="h-px w-6 bg-line lg:hidden" />
            </h2>

            {rows.length === 0 ? (
              <p className="rounded-xl border border-line bg-paper px-4 py-6 text-center text-sm italic text-muted">
                Chưa có dữ liệu.
              </p>
            ) : (
              <ul className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_10px_28px_-20px_rgba(67,56,43,0.4)]">
                {rows.map((r, i) => {
                  const positive = r.sum > 0;
                  const negative = r.sum < 0;
                  const barW = (Math.abs(r.sum) / maxAbs) * 100;
                  return (
                    <li
                      key={i}
                      className="relative flex items-center justify-between gap-3 border-b border-line/60 px-4 py-2 transition-colors last:border-b-0 hover:bg-cream/40"
                    >
                      {/* Thanh tỉ lệ theo độ lớn */}
                      <span
                        className={`absolute inset-y-0 left-0 ${
                          negative ? "bg-dusty/20" : positive ? "bg-sage/15" : "bg-transparent"
                        }`}
                        style={{ width: `${barW}%` }}
                      />
                      <span className="relative flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-serif text-xs font-semibold ${
                            negative
                              ? "bg-dusty/20 text-terracotta"
                              : positive
                              ? "bg-sage/20 text-sage"
                              : "bg-cream text-muted"
                          }`}
                        >
                          {initialOf(r.name)}
                        </span>
                        <span className="text-sm font-medium text-ink">{r.name}</span>
                      </span>
                      <span
                        className={`relative font-serif text-sm font-semibold tabular-nums ${
                          negative ? "text-terracotta" : positive ? "text-sage" : "text-muted/70"
                        }`}
                      >
                        {positive ? "+" : ""}
                        {formatVND(r.sum)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="mx-auto mt-10 text-center font-serif text-lg text-line">❧</div>
      </div>
    </main>
  );
}
