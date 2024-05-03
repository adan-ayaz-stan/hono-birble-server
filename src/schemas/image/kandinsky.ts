import { z } from 'zod';

export const kandinskySchema = z.object({
	seed: z.number().optional(),
	width: z
		.enum([
			'384',
			'512',
			'576',
			'640',
			'704',
			'768',
			'960',
			'1024',
			'1152',
			'1280',
			'1536',
			'1792',
			'2048',
		])
		.default('512')
		.transform(v => parseInt(v, 10)),
	height: z
		.enum([
			'384',
			'512',
			'576',
			'640',
			'704',
			'768',
			'960',
			'1024',
			'1152',
			'1280',
			'1536',
			'1792',
			'2048',
		])
		.default('512')
		.transform(v => parseInt(v, 10)),
	prompt: z.string(),
	num_outputs: z.number().max(4).min(1).default(1),
	output_format: z.enum(['webp', 'jpeg', 'png']).default('webp'),
	negative_prompt: z.string().optional(),
	num_inference_steps: z.number().max(500).min(1).default(75),
	num_inference_steps_prior: z.number().max(500).min(1).default(25),
});

export type TKandinskyInput = z.infer<typeof kandinskySchema>;
