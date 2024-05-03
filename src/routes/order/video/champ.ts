import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { champVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { champSchema } from '../../../schemas/video/champ';
import champOrderQueue from '../../../services/queue/champ-q';

export const createChampOrder = new Hono();

createChampOrder.post(
	'/champ',
	validator('json', (value, c) => {
		const parsed = champSchema.safeParse(value);
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
				modelVersion: champVersion,
			},
		});
		champOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
