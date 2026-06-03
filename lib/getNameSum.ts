// Fetch dữ liệu {tên, tổng tiền} từ Google Sheet qua API gviz.
// Sheet trả JSON bọc trong /*O_o*/\ngoogle.visualization.Query.setResponse({...});
// nên phải strip wrapper trước khi JSON.parse.

export type NameSum = {
  name: string;
  sum: number;
};

export async function fetchNameSum(url: string): Promise<NameSum[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } }); // cache 60s
    if (!res.ok) return [];
    const text = await res.text();

    // Lấy phần JSON nằm giữa { đầu tiên và } cuối — bền hơn cắt cứng 47 ký tự.
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return [];
    const json = JSON.parse(text.slice(start, end + 1));

    const rows: NameSum[] = (json.table?.rows ?? [])
      .filter((row: any) => row.c?.[0]?.v) // bỏ row trống
      .map((row: any) => ({
        name: String(row.c[0].v),
        sum: Number(row.c[1]?.v ?? 0),
      }));

    return rows;
  } catch {
    return [];
  }
}
