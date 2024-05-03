import { z } from 'zod';

export const champSchema = z.object({
	guidance_data: z
		.enum([
			'example_data/motions/motion-01',
			'example_data/motions/motion-02',
			'example_data/motions/motion-03',
			'example_data/motions/motion-04',
			'example_data/motions/motion-05',
			'example_data/motions/motion-06',
			'example_data/motions/motion-07',
			'example_data/motions/motion-08',
			'example_data/motions/motion-09',
		])
		.default('example_data/motions/motion-01'),
	ref_image_path: z
		.string()
		.default(
			'https://res.cloudinary.com/dsupzktwn/image/upload/v1713969783/932c5fad-b1ec-4e13-964f-20936db20954_dyg0yo.png',
		),
});

export type TchampInput = z.infer<typeof champSchema>;
