import { z } from 'zod';

export const mustangoSchema = z.object({
	steps: z.number().default(100),
	prompt: z
		.string()
		.default(
			"This is a new age piece. There is a flute playing the main melody with a lot of staccato notes. The rhythmic background consists of a medium tempo electronic drum beat with percussive elements all over the spectrum. There is a playful atmosphere to the piece. This piece can be used in the soundtrack of a children's TV show or an advertisement jingle.",
		),
	guidance: z.number().default(3),
});

export type TmustangoInput = z.infer<typeof mustangoSchema>;
