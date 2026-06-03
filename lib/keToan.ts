// Sổ tiền ăn theo từng kế toán.
// - DungnT: lấy data thật từ Google Sheet (cột F = tên, G = tổng tiền).
// - HungNb: tạm mock, thay sau.

import { fetchNameSum, type NameSum } from "./getNameSum";
import { getSoNo } from "./getSoNo";

export type { NameSum };

export type Accountant = {
  slug: string; // dùng cho route /ke-toan/<slug>
  name: string; // tên hiển thị
};

export const ACCOUNTANTS: Accountant[] = [
  { slug: "dungnt", name: "DungnT" },
  { slug: "hungnb", name: "HungNb" },
];

// Nguồn Google Sheet dạng {tên, tổng} (cột F, G)
const SHEET_URLS: Record<string, string> = {
  dungnt:
    "https://docs.google.com/spreadsheets/d/1Fl4SNiWeKxIxyHkkzdvoW1emsD0-kvU_yGcN-i76dFQ/gviz/tq?tqx=out:json&sheet=Ti%E1%BB%81n%20%C4%83n&range=F2:G1000&headers=1",
};

export function getAccountant(slug: string): Accountant | undefined {
  return ACCOUNTANTS.find((a) => a.slug === slug);
}

// Lấy danh sách {tên, tổng} cho 1 kế toán
export async function getRows(slug: string): Promise<NameSum[]> {
  // HungNb: sheet dạng ma trận → lấy tổng mỗi người từ dòng "Tổng"
  if (slug === "hungnb") {
    const data = await getSoNo();
    return data.danhSach.map((name) => ({ name, sum: data.tong[name] ?? 0 }));
  }

  // Các kế toán dùng sheet {tên, tổng}
  const url = SHEET_URLS[slug];
  if (url) return fetchNameSum(url);
  return [];
}

export function totalOf(rows: NameSum[]): number {
  return rows.reduce((s, r) => s + r.sum, 0);
}

export function formatVND(n: number): string {
  return n.toLocaleString("vi-VN") + "₫";
}
