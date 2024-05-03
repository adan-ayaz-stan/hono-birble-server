import { z } from 'zod';

export const stylettsSchema = z.object({
	beta: z.number().min(0).max(1).default(0.7),
	seed: z.number().default(0),
	text: z
		.string()
		.default(
			'StyleTTS 2 is a text-to-speech model that leverages style diffusion and adversarial training with large speech language models to achieve human-level text-to-speech synthesis.',
		),
	alpha: z.number().min(0).max(1).default(0.3),
	weights: z.string().optional(),
	reference: z.string().optional(),
	diffusion_steps: z.number().min(0).max(50).default(10),
	embedding_scale: z.number().min(0).max(5).default(1),
});

export type TstylettsInput = z.infer<typeof stylettsSchema>;
