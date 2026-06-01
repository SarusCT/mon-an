# 🍜 Random đồ ăn

Mỗi ngày tự random một "Món ăn hôm nay", cố định cả ngày, **không trùng món hôm qua** (chỉ 5% được phép trùng). Lưu lịch sử 1 tuần trên Upstash Redis, có bảng xếp hạng tuần và ảnh OG động để chia sẻ link.

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000
```

Biến môi trường trong `.env.local`:

```
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

## Sửa danh sách món

Sửa mảng `FOODS` trong `lib/foods.ts`.

## Cách hoạt động

- `lib/picker.ts` — đọc key `food:YYYY-MM-DD` (giờ VN). Nếu chưa có thì chọn món mới:
  - 95% chọn trong các món *trừ* món hôm qua, 5% chọn trong *toàn bộ* (có thể trùng).
  - Lưu bằng `SET NX` (an toàn khi nhiều request) + TTL 8 ngày (tự dọn rác sau ~1 tuần).
- `app/api/today/route.ts` — API trả về món hôm nay + lịch sử + bảng xếp hạng.
- `app/page.tsx` — `generateMetadata` set title/og theo món hôm nay.
- `app/opengraph-image.tsx` — vẽ ảnh OG gradient 1200×630 cho mạng xã hội.
- `app/FoodClient.tsx` — UI gradient + animation quay random.

## Lưu ý khi deploy

Đặt `NEXT_PUBLIC_SITE_URL` = domain thật (vd `https://abc.vercel.app`) để link OG image là URL tuyệt đối. Mạng xã hội cache ảnh OG khá lâu — link mới mỗi ngày có thể cần chờ cache hết hạn.
