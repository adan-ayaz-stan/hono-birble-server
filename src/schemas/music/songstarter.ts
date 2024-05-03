import { z } from 'zod';

export const songStarterSchema = z.object({
	seed: z.number().optional(),
	top_k: z.number().default(250),
	top_p: z.number().default(0),
	prompt: z.string().default('trap, synthesizer, dark, D minor, 155 bpm'),
	duration: z.number().default(8),
	input_audio: z
		.string()
		.default(
			'https://res.cloudinary.com/dsupzktwn/video/upload/v1714350899/assets_bach_mh1hwu.mp3',
		),
	temperature: z.number().default(1),
	continuation: z.boolean().default(false),
	output_format: z.enum(['wav', 'mp3']).default('wav'),
	continuation_end: z.number().min(0).optional(),
	continuation_start: z.number().min(0).default(0),
	normalization_strategy: z.enum(['loudness', 'clip', 'peak', 'rms']).default('loudness'),
	classifier_free_guidance: z.number().default(3),
});

export type TSongStarterInput = z.infer<typeof songStarterSchema>;
