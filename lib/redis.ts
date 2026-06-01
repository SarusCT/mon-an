import { Redis } from "@upstash/redis";

// Đọc UPSTASH_REDIS_REST_URL và UPSTASH_REDIS_REST_TOKEN từ env (.env.local).
export const redis = Redis.fromEnv();
