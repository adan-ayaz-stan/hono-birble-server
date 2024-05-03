import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { realisticVisionImpatingVersion } from '../../../../constants/models';
import prisma from '../../../../lib/db/prisma';
import { realisticVisionImpatingSchema } from '../../../../schemas/image/realistic-vision-impating';
import RVImpaintingOrderQueue from '../../../../services/queue/realistic-vision-impainting-q';

export const createRealisticVisionImpatingOrder = new Hono();

createRealisticVisionImpatingOrder.post(
	'/realistic-vision-impating',
	validator('json', (value, c) => {
		const parsed = realisticVisionImpatingSchema.safeParse(value);
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
				modelVersion: realisticVisionImpatingVersion,
			},
		});
		RVImpaintingOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
