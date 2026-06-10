import type { Metadata } from "next";
import { getToday } from "@/lib/picker";
import { getSiteUrl } from "@/lib/siteUrl";
import FoodClient from "./FoodClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { food, date } = await getToday();
    const title = `Hôm nay ăn gì? → ${food}`;
    const description = `Món ăn hôm nay (${date}) là: ${food}. Mỗi ngày một gợi ý, không trùng hôm qua!`;
    const imageUrl = `${getSiteUrl()}/api/og?d=${date}`;
    if (typeof window !== "undefined") (window as any).pw = "TruongQuaDepTrai";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [{ url: imageUrl, width: 1200, height: 630, alt: `Món hôm nay: ${food}` }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "Hôm nay ăn gì?" };
  }
}

export default async function Page() {
  const data = await getToday();
  return <FoodClient initial={data} />;
}
