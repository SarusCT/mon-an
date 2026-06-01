import { redis } from "./redis";
import { getFoods } from "./foodStore";

const TZ = "Asia/Ho_Chi_Minh";
const REPEAT_RATE = 0.05; // 5% xác suất được phép trùng món hôm qua
const TTL_SECONDS = 60 * 60 * 24 * 8; // giữ mỗi ngày 8 ngày -> lịch sử ~1 tuần

export type DayPick = { date: string; food: string; image: string };
export type RankItem = { food: string; image: string; count: number };
export type TodayResult = {
  date: string;
  food: string;
  image: string;
  pool: string[]; // tên các món hiện có (cho animation quay)
  history: DayPick[]; // 7 ngày gần nhất (mới -> cũ)
  ranking: RankItem[]; // xếp hạng theo số lần xuất hiện trong tuần
};

// Định dạng ngày theo giờ Việt Nam: YYYY-MM-DD
function vnDateString(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
}

// Lấy chuỗi ngày của N ngày gần nhất (index 0 = hôm nay).
function lastNDates(n: number): string[] {
  const nowMs = Date.now();
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(vnDateString(new Date(nowMs - i * 86_400_000)));
  }
  return out;
}

const keyFor = (date: string) => `food:${date}`;

// Chọn 1 món từ pool, tránh trùng món hôm qua (chỉ 5% được phép trùng).
function pickFood(pool: string[], previous: string | null): string {
  const roll = Math.random();
  let candidates = pool;
  if (previous && roll >= REPEAT_RATE) {
    const filtered = pool.filter((f) => f !== previous);
    if (filtered.length > 0) candidates = filtered;
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Lấy món hôm nay (cố định cả ngày) + lịch sử + bảng xếp hạng tuần.
export async function getToday(): Promise<TodayResult> {
  const foods = await getFoods();
  const names = foods.map((f) => f.name);
  const imageByName = new Map(foods.map((f) => [f.name, f.image]));
  const imgOf = (name: string) => imageByName.get(name) ?? "";

  const dates = lastNDates(7);
  const todayKey = keyFor(dates[0]);

  let today = (await redis.get<string>(todayKey)) ?? null;

  if (!today) {
    const yesterday = (await redis.get<string>(keyFor(dates[1]))) ?? null;
    const candidate = pickFood(names, yesterday);
    // SET NX để tránh 2 request cùng lúc chọn 2 món khác nhau.
    const ok = await redis.set(todayKey, candidate, { nx: true, ex: TTL_SECONDS });
    today = ok ? candidate : ((await redis.get<string>(todayKey)) ?? candidate);
  }

  // Đọc lịch sử 7 ngày.
  const values = await Promise.all(dates.map((d) => redis.get<string>(keyFor(d))));

  const history: DayPick[] = [];
  const counts = new Map<string, number>();
  dates.forEach((date, i) => {
    const food = values[i];
    if (food) {
      history.push({ date, food, image: imgOf(food) });
      counts.set(food, (counts.get(food) ?? 0) + 1);
    }
  });

  const ranking: RankItem[] = Array.from(counts.entries())
    .map(([food, count]) => ({ food, image: imgOf(food), count }))
    .sort((a, b) => b.count - a.count || a.food.localeCompare(b.food));

  return {
    date: dates[0],
    food: today,
    image: imgOf(today),
    pool: names,
    history,
    ranking,
  };
}
