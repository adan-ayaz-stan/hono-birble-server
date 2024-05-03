import { z } from 'zod';

export const photomakerSchema = z.object({
	seed: z.number().min(0).max(2147483647).optional(),
	prompt: z.string().default('A photo of a person img'),
	num_steps: z.number().min(1).max(100).default(20),
	style_name: z
		.enum([
			'(No style)',
			'Cinematic',
			'Disney Charactor',
			'Digital Art',
			'Photographic (Default)',
			'Fantasy art',
			'Neonpunk',
			'Enhance',
			'Comic book',
			'Lowpoly',
			'Line art',
		])
		.default('Cinematic'),
	input_image: z
		.string()
		.default(
			'https://res.cloudinary.com/dsupzktwn/image/upload/v1713896504/musk_resize_oenbwl.jpg',
		),
	num_outputs: z.number().min(1).max(4).default(1),
	input_image2: z.string().optional(),
	input_image3: z.string().optional(),
	input_image4: z.string().optional(),
	guidance_scale: z.number().min(1).max(10).default(5),
	negative_prompt: z.string().optional(),
	style_strength_ratio: z.number().min(15).max(50).default(20),
	disable_safety_checker: z.boolean().default(false),
});

export type TphotomakerSchema = z.infer<typeof photomakerSchema>;
