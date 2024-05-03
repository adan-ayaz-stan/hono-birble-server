import { z } from 'zod';

export const shefaSchema = z.object({
	seed: z.number().optional(),
	image: z.string().optional(),
	width: z.number().default(448),
	height: z.number().default(896),
	prompt: z.string(),
	embeddings: z.string().optional(),
	faceswap_fast: z.boolean().default(false),
	faceswap_slow: z.boolean().default(false),
	guidance_scale: z.number().min(1).max(3).default(1.77),
	num_refine_steps: z.number().min(0).max(5).default(3),
	num_inference_steps: z.number().min(1).max(10).default(7),
	disable_safety_checker: z.boolean().default(false),
});

export type TShefaSchema = z.infer<typeof shefaSchema>;
