"use client";

import { useEffect, useState } from "react";

type FoodItem = { id: string; name: string; image: string };

export default function FoodManager() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "err" | "ok"; text: string } | null>(null);

  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  // bản nháp khi sửa từng món
  const [drafts, setDrafts] = useState<Record<string, { name: string; image: string }>>({});

  async function loadFoods() {
    try {
      const res = await fetch("/api/foods", { cache: "no-store" });
      const data = await res.json();
      setFoods(data.foods ?? []);
    } catch {
      setMsg({ type: "err", text: "Không tải được danh sách" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  function flash(type: "err" | "ok", text: string) {
    setMsg({ type, text });
    if (type === "ok") setTimeout(() => setMsg(null), 2500);
  }

  function startEditing() {
    setEditing(true);
    setDrafts(
      Object.fromEntries(foods.map((f) => [f.id, { name: f.name, image: f.image }]))
    );
  }

  function stopEditing() {
    setEditing(false);
    setPassword("");
    setMsg(null);
  }

  async function call(method: string, body: object): Promise<boolean> {
    if (!password.trim()) {
      flash("err", "Nhập mật khẩu trước đã");
      return false;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/foods", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        flash("err", data?.error ?? "Có lỗi xảy ra");
        return false;
      }
      setFoods(data.foods ?? []);
      setDrafts(
        Object.fromEntries(
          (data.foods ?? []).map((f: FoodItem) => [f.id, { name: f.name, image: f.image }])
        )
      );
      return true;
    } catch {
      flash("err", "Lỗi kết nối");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleAdd() {
    if (!newName.trim()) return flash("err", "Nhập tên món");
    const ok = await call("POST", { name: newName, image: newImage });
    if (ok) {
      setNewName("");
      setNewImage("");
      flash("ok", "Đã thêm món");
    }
  }

  async function handleSave(id: string) {
    const d = drafts[id];
    if (!d) return;
    const ok = await call("PUT", { id, name: d.name, image: d.image });
    if (ok) flash("ok", "Đã lưu");
  }

  async function handleDelete(id: string) {
    const ok = await call("DELETE", { id });
    if (ok) flash("ok", "Đã xoá");
  }

  const inputCls =
    "w-full rounded-md border border-line bg-cream/50 px-2.5 py-1.5 text-sm text-ink outline-none focus:border-terracotta";

  return (
    <section className="animate-fade [animation-delay:320ms]">
      <h2 className="mb-4 flex items-center justify-center gap-3 font-serif text-xl font-semibold text-ink">
        <span className="h-px w-6 bg-line" />
        Danh sách món ({foods.length})
        <span className="h-px w-6 bg-line" />
      </h2>

      <div className="overflow-hidden rounded-xl border border-line bg-paper">
        {/* Thanh công cụ */}
        <div className="flex items-center justify-between border-b border-line/70 px-4 py-2.5">
          <span className="font-serif text-sm italic text-muted">
            {editing ? "Đang chỉnh sửa" : "Các món sẽ được random"}
          </span>
          {editing ? (
            <button
              onClick={stopEditing}
              className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted hover:bg-cream"
            >
              Xong
            </button>
          ) : (
            <button
              onClick={startEditing}
              className="rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-paper hover:bg-[#a25842]"
            >
              ✎ Sửa
            </button>
          )}
        </div>

        {/* Ô mật khẩu khi sửa */}
        {editing && (
          <div className="border-b border-line/70 bg-cream/40 px-4 py-3">
            <label className="mb-1 block text-xs font-medium text-muted">
              Mật khẩu quản trị
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu…"
              className={inputCls}
            />
          </div>
        )}

        {/* Thông báo */}
        {msg && (
          <div
            className={`px-4 py-2 text-xs ${
              msg.type === "err" ? "bg-dusty/20 text-terracotta" : "bg-sage/20 text-sage"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Danh sách món */}
        {loading ? (
          <p className="px-4 py-6 text-center text-sm italic text-muted">Đang tải…</p>
        ) : (
          <ul className="max-h-[22rem] overflow-y-auto">
            {foods.map((f) => (
              <li
                key={f.id}
                className="border-b border-line/60 px-4 py-2.5 last:border-b-0"
              >
                {editing ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        value={drafts[f.id]?.name ?? ""}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [f.id]: { ...d[f.id], name: e.target.value },
                          }))
                        }
                        className={inputCls}
                        placeholder="Tên món"
                      />
                      <button
                        onClick={() => handleSave(f.id)}
                        disabled={busy}
                        className="shrink-0 rounded-md bg-sage px-2.5 py-1.5 text-xs font-semibold text-paper hover:opacity-90 disabled:opacity-50"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        disabled={busy}
                        className="shrink-0 rounded-md border border-line px-2.5 py-1.5 text-xs font-semibold text-terracotta hover:bg-dusty/15 disabled:opacity-50"
                      >
                        Xoá
                      </button>
                    </div>
                    <input
                      value={drafts[f.id]?.image ?? ""}
                      onChange={(e) =>
                        setDrafts((d) => ({
                          ...d,
                          [f.id]: { ...d[f.id], image: e.target.value },
                        }))
                      }
                      className={`${inputCls} text-xs`}
                      placeholder="Link ảnh (URL)"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {f.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={f.image}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-md object-cover sepia-[0.2] ring-1 ring-line"
                      />
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cream text-sm">
                        🍽️
                      </span>
                    )}
                    <span className="truncate text-sm text-ink">{f.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Form thêm món */}
        {editing && (
          <div className="space-y-1.5 border-t border-line bg-cream/40 px-4 py-3">
            <p className="text-xs font-medium text-muted">+ Thêm món mới</p>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={inputCls}
              placeholder="Tên món"
            />
            <input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className={`${inputCls} text-xs`}
              placeholder="Link ảnh (URL) — không bắt buộc"
            />
            <button
              onClick={handleAdd}
              disabled={busy}
              className="w-full rounded-md bg-terracotta py-2 text-sm font-semibold text-paper hover:bg-[#a25842] disabled:opacity-50"
            >
              Thêm món
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
