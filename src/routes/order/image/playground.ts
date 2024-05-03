import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { playgroundVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { playgroundSchema } from '../../../schemas/image/playground';
import playgroundOrderQueue from '../../../services/queue/playground-q';

export const createPlaygroundOrder = new Hono();

createPlaygroundOrder.post(
	'/playground',
	validator('json', (value, c) => {
		const parsed = playgroundSchema.safeParse(value);
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
				modelVersion: playgroundVersion,
			},
		});
		playgroundOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
