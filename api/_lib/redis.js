import { Redis } from "@upstash/redis";

// One shared Upstash Redis client. The Upstash integration from the Vercel
// Marketplace sets KV_REST_API_*; a store created directly at Upstash uses
// UPSTASH_REDIS_REST_*. Either pair works.
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});
