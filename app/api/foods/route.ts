import { NextRequest, NextResponse } from "next/server";
import { getFoods, addFood, updateFood, deleteFood } from "@/lib/foodStore";

export const dynamic = "force-dynamic";

// Đọc từ env để không lộ mật khẩu trong source (đặt trong .env.local / host).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function checkPassword(pw: unknown): boolean {
  return typeof pw === "string" && !!ADMIN_PASSWORD && pw === ADMIN_PASSWORD;
}

const unauthorized = () =>
  NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });

// GET: trả danh sách món (công khai)
export async function GET() {
  try {
    const foods = await getFoods();
    return NextResponse.json({ foods });
  } catch (err) {
    console.error("[/api/foods GET]", err);
    return NextResponse.json({ error: "Lỗi đọc danh sách" }, { status: 500 });
  }
}

// POST: thêm món mới { password, name, image }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!checkPassword(body?.password)) return unauthorized();
    const name = String(body?.name ?? "").trim();
    const image = String(body?.image ?? "").trim();
    if (!name) return NextResponse.json({ error: "Thiếu tên món" }, { status: 400 });
    const foods = await addFood(name, image);
    return NextResponse.json({ foods });
  } catch (err) {
    console.error("[/api/foods POST]", err);
    return NextResponse.json({ error: "Lỗi thêm món" }, { status: 500 });
  }
}

// PUT: sửa món { password, id, name, image }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!checkPassword(body?.password)) return unauthorized();
    const id = String(body?.id ?? "");
    const name = String(body?.name ?? "").trim();
    const image = String(body?.image ?? "").trim();
    if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
    if (!name) return NextResponse.json({ error: "Thiếu tên món" }, { status: 400 });
    const foods = await updateFood(id, name, image);
    return NextResponse.json({ foods });
  } catch (err) {
    console.error("[/api/foods PUT]", err);
    return NextResponse.json({ error: "Lỗi sửa món" }, { status: 500 });
  }
}

// DELETE: xoá món { password, id }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (!checkPassword(body?.password)) return unauthorized();
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
    const current = await getFoods();
    if (current.length <= 1) {
      return NextResponse.json(
        { error: "Phải còn ít nhất 1 món" },
        { status: 400 }
      );
    }
    const foods = await deleteFood(id);
    return NextResponse.json({ foods });
  } catch (err) {
    console.error("[/api/foods DELETE]", err);
    return NextResponse.json({ error: "Lỗi xoá món" }, { status: 500 });
  }
}
