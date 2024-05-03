import { z } from 'zod';

export const faceSwapSchema = z.object({
	swap_image: z
		.string()
		.default(
			'https://res.cloudinary.com/dsupzktwn/image/upload/v1714073117/long-trench-coat_q8uruk.png',
		),
	target_image: z
		.string()
		.default('https://res.cloudinary.com/dsupzktwn/image/upload/v1714073118/9X2_rkgowj.png'),
});

export type TfaceSwapInput = z.infer<typeof faceSwapSchema>;
