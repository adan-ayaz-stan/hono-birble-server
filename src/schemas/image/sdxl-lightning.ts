import { z } from 'zod';

export const SDXLLightningSchema = z.object({
	seed: z.number().int().optional(),
	width: z.number().int().min(1024).optional().default(1024),
	height: z.number().int().min(1024).optional().default(1024),
	prompt: z.string().optional().default('A superhero smiling'),
	scheduler: z
		.string()
		.refine(
			val =>
				[
					'DDIM',
					'DPMSolverMultistep',
					'HeunDiscrete',
					'KarrasDPM',
					'K_EULER_ANCESTRAL',
					'K_EULER',
					'PNDM',
					'DPM++2MSDE',
				].includes(val),
			{
				message:
					'scheduler must be one of: DDIM, DPMSolverMultistep, HeunDiscrete, KarrasDPM, K_EULER_ANCESTRAL, K_EULER, PNDM, DPM++2MSDE',
			},
		)
		.optional()
		.default('K_EULER'),
	num_outputs: z.number().int().min(1).max(4).optional().default(1),
	guidance_scale: z.number().min(0).max(50).optional().default(0),
	negative_prompt: z.string().optional().default('worst quality, low quality'),
	num_inference_steps: z.number().int().min(1).max(10).optional().default(4),
	disable_safety_checker: z.boolean().optional().default(false),
});

export type TSDXLLightningInput = z.infer<typeof SDXLLightningSchema>;
