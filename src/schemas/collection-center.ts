import { modelVersionEnum } from "../constants/models";
import z from "zod";

export const collectionInputSchema = z.object({
  userId: z.string(),
  prompt: z.string(),
  collectionId: z.string(),
  count: z.number(),
  refImage: z.string().optional(),
  modelVersion: modelVersionEnum,
});
