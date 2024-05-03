import { z } from 'zod';

export const musicgenSchema = z.object({
	seed: z.number().optional(),
	top_k: z.number().default(250),
	top_p: z.number().default(0),
	prompt: z
		.string()
		.default(
			'Edo25 major g melodies that sound triumphant and cinematic. Leading up to a crescendo that resolves in a 9th harmonic',
		),
	duration: z.number().default(8),
	input_audio: z.string().optional(),
	temperature: z.number().default(1),
	continuation: z.boolean().default(false),
	model_version: z
		.enum(['stereo-melody-large', 'stereo-large', 'melody-large', 'large'])
		.default('stereo-melody-large'),
	output_format: z.enum(['wav', 'mp3']).default('wav'),
	continuation_end: z.number().min(0).optional(),
	continuation_start: z.number().min(0).default(0),
	multi_band_diffusion: z.boolean().default(false),
	normalization_strategy: z.enum(['loudness', 'clip', 'peak', 'rms']).default('loudness'),
	classifier_free_guidance: z.number().default(3),
});

export type TmusicgenInput = z.infer<typeof musicgenSchema>;
