import { z } from 'zod';

export const zeroScopeSchema = z.object({
	fps: z.number().default(8),
	seed: z.number().optional(),
	model: z.enum(['xl', '576w', 'potat1', 'animov-512x']).default('xl'),
	width: z.number().min(256).default(576),
	height: z.number().min(256).default(320),
	prompt: z.string().default('An astronaut riding a horse'),
	batch_size: z.number().min(1).default(1),
	init_video: z.string().optional(),
	num_frames: z.number().default(24),
	init_weight: z.number().default(0.5),
	guidance_scale: z.number().min(1).max(100).default(7.5),
	negative_prompt: z.string().optional(),
	remove_watermark: z.boolean().default(false),
	num_inference_steps: z.number().min(1).max(500).default(50),
});

export type TZeroscopeInput = z.infer<typeof zeroScopeSchema>;
