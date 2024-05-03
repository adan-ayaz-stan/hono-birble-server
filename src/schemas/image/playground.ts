import { z } from 'zod';

export const playgroundSchema = z.object({
	seed: z.number().int().optional(),
	width: z.number().int().gte(1).optional().default(1024),
	height: z.number().int().gte(1).optional().default(1024),
	prompt: z.string(),
	scheduler: z
		.string()
		.refine(
			val =>
				[
					'DDIM',
					'DPMSolverMultistep',
					'HeunDiscrete',
					'K_EULER_ANCESTRAL',
					'K_EULER',
					'PNDM',
				].includes(val),
			{
				message:
					'scheduler must be one of: DDIM, DPMSolverMultistep, HeunDiscrete, K_EULER_ANCESTRAL, K_EULER, PNDM',
			},
		)
		.optional()
		.default('K_EULER_ANCESTRAL'),
	guidance_scale: z.number().gte(1).lte(50).optional().default(3),
	apply_watermark: z.boolean().optional().default(false),
	negative_prompt: z.string().optional().default(''),
	num_inference_steps: z.number().int().gte(1).lte(500).optional().default(50),
	disable_safety_checker: z.boolean().optional().default(false),
});

export type TPlaygroundSchema = z.infer<typeof playgroundSchema>;
