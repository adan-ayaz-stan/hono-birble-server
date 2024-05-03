import { z } from 'zod';

export const llava13bSchema = z.object({
	image: z
		.string()
		.default('https://res.cloudinary.com/dsupzktwn/image/upload/v1714073674/view_pnpwys.jpg'),
	top_p: z.number().min(0).max(1).default(1),
	prompt: z.string().default('Are you allowed to swim here?'),
	max_tokens: z.number().min(0).default(1024),
	temperature: z.number().min(0).default(0.2),
});

export type Tllava13bInput = z.infer<typeof llava13bSchema>;
