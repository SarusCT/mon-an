import { redis } from "./redis";
import { DEFAULT_FOODS } from "./foods";

export type FoodItem = { id: string; name: string; image: string };

const KEY = "foods:list";

function genId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `f_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

// Đọc danh sách món từ Redis. Lần đầu (rỗng) thì seed từ DEFAULT_FOODS.
export async function getFoods(): Promise<FoodItem[]> {
  const list = await redis.get<FoodItem[]>(KEY);
  if (!list || !Array.isArray(list) || list.length === 0) {
    const seeded: FoodItem[] = DEFAULT_FOODS.map((f) => ({
      id: genId(),
      name: f.name,
      image: f.image,
    }));
    await redis.set(KEY, seeded);
    return seeded;
  }
  return list;
}

async function saveFoods(list: FoodItem[]): Promise<void> {
  await redis.set(KEY, list);
}

export async function addFood(name: string, image: string): Promise<FoodItem[]> {
  const list = await getFoods();
  list.push({ id: genId(), name: name.trim(), image: image.trim() });
  await saveFoods(list);
  return list;
}

export async function updateFood(
  id: string,
  name: string,
  image: string
): Promise<FoodItem[]> {
  const list = await getFoods();
  const idx = list.findIndex((f) => f.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], name: name.trim(), image: image.trim() };
    await saveFoods(list);
  }
  return list;
}

export async function deleteFood(id: string): Promise<FoodItem[]> {
  const list = await getFoods();
  const next = list.filter((f) => f.id !== id);
  await saveFoods(next);
  return next;
}
