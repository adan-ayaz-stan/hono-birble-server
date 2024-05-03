import { z } from 'zod';

export const realisticVisionImpatingSchema = z.object({
	mask: z
		.string()
		.default(
			'https://res.cloudinary.com/dsupzktwn/image/upload/v1714071335/pexels-ali-pazani-2787341_mmpjdc.png',
		),
	image: z
		.string()
		.default(
			'https://res.cloudinary.com/dsupzktwn/image/upload/v1714071338/pexels-ali-pazani-2787341_mask_xnfip6.png',
		),
	steps: z.number().min(0).max(100).default(20),
	prompt: z
		.string()
		.default(
			'RAW photo, a portrait photo of Katie Read in casual clothes, natural skin, 8k uhd, high quality, film grain, Fujifilm XT3',
		),
	strength: z.number().min(0).max(1).default(0.8),
	num_outputs: z.number().min(0).max(5).default(1),
	guaidance_scale: z.number().min(0).max(20).default(7.5),
	negative_prompt: z
		.string()
		.default(
			'(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck',
		),
});

export type TrealisticVisionImpatingInput = z.infer<typeof realisticVisionImpatingSchema>;
