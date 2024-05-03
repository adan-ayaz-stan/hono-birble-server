import { z } from 'zod';

const RefineEnum = z.enum(['no_refiner', 'expert_ensemble_refiner', 'base_image_refiner']);
const SchedulerEnum = z.enum([
	'DDIM',
	'DPMSolverMultistep',
	'HeunDiscrete',
	'KarrasDPM',
	'K_EULER_ANCESTRAL',
	'K_EULER',
	'PNDM',
]);

export const SDXLSchema = z.object({
	mask: z.string().url().optional(),
	seed: z.number().optional(),
	image: z.string().url().optional(),
	width: z.number().default(1024),
	height: z.number().default(1024),
	prompt: z.string().default('An astronaut riding a rainbow unicorn'),
	refine: RefineEnum.default('no_refiner'),
	scheduler: SchedulerEnum.default('K_EULER'),
	lora_scale: z.number().min(0).max(1).default(0.6),
	num_outputs: z.number().min(1).max(4).default(1),
	refine_steps: z.number().optional(),
	guidance_scale: z.number().min(1).max(50).default(7.5),
	apply_watermark: z.boolean().default(true),
	high_noise_frac: z.number().min(0).max(1).default(0.8),
	negative_prompt: z.string().default(''),
	prompt_strength: z.number().min(0).max(1).default(0.8),
	num_inference_steps: z.number().min(1).max(500).default(50),
	disable_safety_checker: z.boolean().default(false),
});

export type TSDXLSchema = typeof SDXLSchema;
