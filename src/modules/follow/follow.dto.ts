import { z } from "zod";

const followSchema = z.object({
  userId: z.string().uuid(),
  followId: z.string().uuid(),
});
const followerSchema = z.object({
  userId: z.string().uuid(),
  followerId: z.string().uuid(),
});
const followResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  followId: z.string().uuid(),
  createdAt: z.date(),
});
const followerResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  followerId: z.string().uuid(),
  createdAt: z.date(),
});
