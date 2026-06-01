import { ImageResponse } from "next/og";
import { getToday } from "@/lib/picker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Món ăn hôm nay";

// Tải ảnh về server và chuyển sang data URL để nhúng an toàn vào OG image.
// Nếu lỗi -> trả null và OG render dạng gradient chữ (fallback).
async function toDataUrl(url: string): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage() {
  let food = "Hôm nay ăn gì?";
  let date = "";
  let image = "";
  try {
    const data = await getToday();
    food = data.food;
    image = data.image;
    date = data.date.split("-").reverse().join("/");
  } catch {
    // dùng giá trị mặc định
  }

  const bg = await toDataUrl(image);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2e9d8",
          color: "#43382b",
          fontFamily: "serif",
        }}
      >
        {bg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bg}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
        {/* Lớp phủ kem ấm để chữ đọc rõ + giữ tông vintage */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(242,233,216,0.55) 0%, rgba(67,56,43,0.78) 100%)",
          }}
        />
        {/* khung viền giấy */}
        <div
          style={{
            position: "absolute",
            inset: 36,
            display: "flex",
            border: "2px solid rgba(251,245,232,0.7)",
            borderRadius: 16,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 80px",
            color: "#fbf5e8",
          }}
        >
          <div style={{ fontSize: 30, fontStyle: "italic", opacity: 0.9 }}>
            {date}
          </div>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 10,
              marginTop: 18,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            Món hôm nay
          </div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              marginTop: 20,
              lineHeight: 1.1,
              textShadow: "0 4px 20px rgba(0,0,0,0.45)",
            }}
          >
            {food}
          </div>
          <div style={{ fontSize: 28, fontStyle: "italic", marginTop: 34, opacity: 0.9 }}>
            Chốt đơn! Chúc ngon miệng.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
