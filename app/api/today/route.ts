import { NextResponse } from "next/server";
import { getToday } from "@/lib/picker";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getToday();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/today] error", err);
    return NextResponse.json(
      { error: "Không lấy được món hôm nay" },
      { status: 500 }
    );
  }
}
