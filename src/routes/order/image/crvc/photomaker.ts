import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { photomakerVersion } from '../../../../constants/models';
import prisma from '../../../../lib/db/prisma';
import { photomakerSchema } from '../../../../schemas/image/photomaker';
import photomakerOrderQueue from '../../../../services/queue/photomaker-q';

export const createPhotomakerOrder = new Hono();

createPhotomakerOrder.post(
	'/photomaker',
	validator('json', (value, c) => {
		const parsed = photomakerSchema.safeParse(value);
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
				modelVersion: photomakerVersion,
			},
		});
		photomakerOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
