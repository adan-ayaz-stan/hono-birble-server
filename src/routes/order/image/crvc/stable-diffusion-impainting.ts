import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { stableDiffusionInpaintingVersion } from '../../../../constants/models';
import prisma from '../../../../lib/db/prisma';
import { stableDiffusionInpaintingSchema } from '../../../../schemas/image/stable-diffusion-inpainting';
import SDImpantingOrderQueue from '../../../../services/queue/stable-diffusion-impating-q';

export const createStableDiffusionInpaintingOrder = new Hono();

createStableDiffusionInpaintingOrder.post(
	'/stable-diffusion-inpainting',
	validator('json', (value, c) => {
		const parsed = stableDiffusionInpaintingSchema.safeParse(value);
		if (!parsed.success) {
			return c.text('Invalid!', 400);
		}
		return parsed.data;
	}),
	async c => {
		const body = c.req.valid('json');

		const prediction = await prisma.predictions.create({
			data: {
				input: JSON.stringify(body),
				status: 'INQUEUE',
				modelVersion: stableDiffusionInpaintingVersion,
			},
		});
		SDImpantingOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
