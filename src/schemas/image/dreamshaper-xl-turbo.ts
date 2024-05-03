import { z } from 'zod';

export const dreamshaperXLTurboSchema = z.object({
	seed: z.number().optional(),
	width: z.number().default(1024),
	height: z.number().default(1024),
	prompt: z.string().default('An astronaut riding a rainbow unicorn'),
	scheduler: z
		.enum([
			'DDIM',
			'DPMSolverMultistep',
			'HeunDiscrete',
			'KarrasDPM',
			'K_EULER_ANCESTRAL',
			'K_EULER',
			'PNDM',
		])
		.optional(),
	num_outputs: z.number().max(4).min(1).default(1),
	guidance_scale: z.number().max(20).min(1).default(2),
	apply_watermark: z.boolean().default(true),
	negative_prompt: z.string().default(''),
	num_inference_steps: z.number().max(50).min(1).default(6),
	disable_safety_checker: z.boolean().default(false),
});

export type TDreamshaperXLTurbo = z.infer<typeof dreamshaperXLTurboSchema>;
