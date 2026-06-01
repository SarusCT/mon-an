// URL gốc công khai để dựng link tuyệt đối cho OG image.
// Ưu tiên domain production (công khai), KHÔNG dùng VERCEL_URL vì đó là URL
// deployment riêng — thường bị Deployment Protection chặn (401) nên Slack/FB
// không tải được ảnh.
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  );
}
