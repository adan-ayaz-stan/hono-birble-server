import { z } from 'zod';

export const stableDiffusionInpaintingSchema = z.object({
	mask: z
		.string()
		.default('https://res.cloudinary.com/dsupzktwn/image/upload/v1714072041/mask_ea8jgi.png'),
	seed: z.number().optional(),
	image: z
		.string()
		.default(
			'https://res.cloudinary.com/dsupzktwn/image/upload/v1714072042/overture-creations-5sI6fQgYIuo_q8khqe.png',
		),
	width: z
		.enum([
			'64',
			'128',
			'192',
			'256',
			'320',
			'384',
			'448',
			'512',
			'576',
			'640',
			'704',
			'768',
			'832',
			'896',
			'960',
			'1024',
		])
		.default('512')
		.transform(v => parseInt(v, 10)),
	height: z
		.enum([
			'64',
			'128',
			'192',
			'256',
			'320',
			'384',
			'448',
			'512',
			'576',
			'640',
			'704',
			'768',
			'832',
			'896',
			'960',
			'1024',
		])
		.default('512')
		.transform(v => parseInt(v, 10)),
	prompt: z.string().default('a vision of paradise. unreal engine'),
	scheduler: z
		.enum(['DDIM', 'K_EULER', 'DPMSolverMultistep', 'K_EULER_ANCESTRAL', 'PNDM', 'KLMS'])
		.default('DPMSolverMultistep'),
	num_outputs: z.number().min(1).max(4).default(1),
	guidance_scale: z.number().min(1).max(20).default(7.5),
	negative_prompt: z.string().optional(),
	num_inference_steps: z.number().min(1).max(500).default(50),
	disable_safety_checker: z.boolean().default(false),
});

export type TstableDiffusionInpaintingInput = z.infer<typeof stableDiffusionInpaintingSchema>;
