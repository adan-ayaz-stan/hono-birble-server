import { z } from 'zod';

export const instandIdSchema = z.object({
	seed: z.number().optional(),
	image: z
		.string()
		.default(
			'https://res.cloudinary.com/dsupzktwn/image/upload/v1713896504/musk_resize_oenbwl.jpg',
		),
	width: z.number().min(512).max(4096).default(640),
	height: z.number().min(512).max(4096).default(640),
	prompt: z.string().default('a person'),
	scheduler: z
		.enum([
			'DEISMultistepScheduler',
			'HeunDiscreteScheduler',
			'EulerDiscreteScheduler',
			'DPMSolverMultistepScheduler',
			'DPMSolverMultistepScheduler-Karras',
			'DPMSolverMultistepScheduler-Karras-SDE',
		])
		.default('EulerDiscreteScheduler'),
	enable_lcm: z.boolean().default(false),
	pose_image: z
		.string()
		.optional()
		.default(
			'https://res.cloudinary.com/dsupzktwn/image/upload/v1713896503/80048a6e6586759dbcb529e74a9042ca_lu0gty.jpg',
		),
	sdxl_weights: z
		.enum([
			'stable-diffusion-xl-base-1.0',
			'juggernaut-xl-v8',
			'afrodite-xl-v2',
			'albedobase-xl-20',
			'albedobase-xl-v13',
			'animagine-xl-30',
			'anime-art-diffusion-xl',
			'anime-illust-diffusion-xl',
			'dreamshaper-xl',
			'dynavision-xl-v0610',
			'guofeng4-xl',
			'nightvision-xl-0791',
			'omnigen-xl',
			'pony-diffusion-v6-xl',
			'protovision-xl-high-fidel',
		])
		.default('stable-diffusion-xl-base-1.0'),
	pose_strength: z.number().min(0).max(1).default(0.4),
	canny_strength: z.number().min(0).max(1).default(0.3),
	depth_strength: z.number().min(0).max(1).default(0.5),
	guidance_scale: z.number().min(1).max(50).default(7.5),
	negative_prompt: z.string().default(''),
	ip_adapter_scale: z.number().min(0).max(1.5).default(0.8),
	lcm_guidance_scale: z.number().min(1).max(20).default(1.5),
	num_inference_steps: z.number().min(1).max(500).default(30),
	disable_safety_checker: z.boolean().default(false),
	enable_pose_controlnet: z.boolean().default(true),
	enhance_nonface_region: z.boolean().default(true),
	enable_canny_controlnet: z.boolean().default(false),
	enable_depth_controlnet: z.boolean().default(false),
	lcm_num_inference_steps: z.number().min(1).max(10).default(5),
	controlnet_conditioning_scale: z.number().min(0).max(1.5).default(0.8),
});

export type TinstantIdSchema = z.infer<typeof instandIdSchema>;
