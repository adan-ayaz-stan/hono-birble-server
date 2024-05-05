import { z } from "zod";

export const predictionSchema = z.object({
  id: z.string(),
  status: z.enum(["starting", "processing", "succeeded", "failed", "canceled"]),
  output: z.any().optional(),
  error: z.any().optional(),
  input: z.object({
    prompt: z.string(),
  }),
});

export type TPredictionSchema = z.infer<typeof predictionSchema>;
