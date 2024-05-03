import { z } from 'zod';

export const animateDiffSchema = z.object({
	seed: z.number().default(-1),
	steps: z.number().min(1).max(100).default(25),
	width: z.number().default(512),
	frames: z.number().min(1).max(32).default(16),
	height: z.number().default(512),
	prompt: z
		.string()
		.default(
			'photo of vocano, rocks, storm weather, wind, lava waves, lightning, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3',
		),
	base_model: z
		.enum([
			'realisticVisionV20_v20',
			'lyriel_v16',
			'majicmixRealistic_v5Preview',
			'rcnzCartoon3d_v10',
			'toonyou_beta3',
		])
		.default('realisticVisionV20_v20'),
	output_format: z.enum(['mp4', 'gif']).default('mp4'),
	guidance_scale: z.number().min(0).max(20).default(7.5),
	negative_prompt: z
		.string()
		.default(
			'blur, haze, deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers, deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation',
		),
	pan_up_motion_strength: z.number().min(0).max(1).default(0),
	zoom_in_motion_strength: z.number().min(0).max(1).default(0),
	pan_down_motion_strength: z.number().min(0).max(1).default(0),
	pan_left_motion_strength: z.number().min(0).max(1).default(0),
	zoom_out_motion_strength: z.number().min(0).max(1).default(0),
	pan_right_motion_strength: z.number().min(0).max(1).default(0),
	rolling_clockwise_motion_strength: z.number().min(0).max(1).default(0),
	rolling_anticlockwise_motion_strength: z.number().min(0).max(1).default(0),
});

export type TAnimateDiffInput = z.infer<typeof animateDiffSchema>;
