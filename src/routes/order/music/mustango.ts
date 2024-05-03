import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { mustangoVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { mustangoSchema } from '../../../schemas/music/mustango';
import mustangoOrderQueue from '../../../services/queue/mustango-q';

export const createMustangoOrder = new Hono();

createMustangoOrder.post(
	'/mustango',
	validator('json', (value, c) => {
		const parsed = mustangoSchema.safeParse(value);
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
				modelVersion: mustangoVersion,
			},
		});
		mustangoOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
