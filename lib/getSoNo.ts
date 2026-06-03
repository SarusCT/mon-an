// Sổ tiền ăn dạng ma trận (sheet của HungNb):
//   cột A = ngày, cột B→N = từng thành viên, cột O = tổng dòng, cột P = ghi chú.
//   có 1 dòng "Tổng" chứa tổng tiền mỗi thành viên.

export type SoNoRow = {
  ngay: string;
  ghichu: string;
  tongDong: number;
  thanhVien: Record<string, number>;
};

export type SoNoData = {
  rows: SoNoRow[];
  tong: Record<string, number>; // tổng theo từng thành viên (dòng "Tổng")
  danhSach: string[]; // danh sách tên theo thứ tự cột
};

const SHEET_ID = "1_Cx5XTJ_vV1YIn5bV6KolhGD2_JKrTsL4NuXRzoMoyw";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Ti%E1%BB%81n%20%C4%83n%20ae&range=A1:P32&headers=1`;

const EMPTY: SoNoData = { rows: [], tong: {}, danhSach: [] };

export async function getSoNo(): Promise<SoNoData> {
  try {
    const res = await fetch(URL, { next: { revalidate: 60 } });
    if (!res.ok) return EMPTY;
    const text = await res.text();

    const jsonStr = text.match(/setResponse\((\{.*\})\)/s)?.[1] ?? "{}";
    const json = JSON.parse(jsonStr);
    if (!json.table) return EMPTY;

    const cols: { id: string; label: string }[] = json.table.cols;
    const rawRows: any[] = json.table.rows ?? [];

    // Cột thành viên = B→N (index 1..13), bỏ cột A và O, P
    const memberCols = cols.slice(1, 14).filter((c) => c.label?.trim());
    const danhSach = memberCols.map((c) => c.label);

    const rows: SoNoRow[] = [];
    let tong: Record<string, number> = {};

    rawRows.forEach((row: any) => {
      const ngay: string = row.c?.[0]?.v ?? "";
      if (!ngay) return; // bỏ dòng trống

      const thanhVien: Record<string, number> = {};
      memberCols.forEach((col) => {
        const idx = cols.indexOf(col);
        thanhVien[col.label] = Number(row.c?.[idx]?.v ?? 0);
      });

      const tongDong = Number(row.c?.[14]?.v ?? 0); // cột O
      const ghichu: string = row.c?.[15]?.v ?? ""; // cột P

      if (String(ngay).trim() === "Tổng") {
        tong = thanhVien;
      } else {
        rows.push({ ngay, ghichu, tongDong, thanhVien });
      }
    });

    // Nếu sheet không có dòng "Tổng" → tự cộng dồn theo từng người
    if (Object.keys(tong).length === 0) {
      danhSach.forEach((name) => {
        tong[name] = rows.reduce((s, r) => s + (r.thanhVien[name] ?? 0), 0);
      });
    }

    return { rows, tong, danhSach };
  } catch {
    return EMPTY;
  }
}
