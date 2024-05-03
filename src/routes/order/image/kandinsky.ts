import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { kandinskyVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { kandinskySchema } from '../../../schemas/image/kandinsky';
import kandinskyOrderQueue from '../../../services/queue/kandinsky-q';

export const createKandinskyOrder = new Hono();

createKandinskyOrder.post(
	'/kandinsky',
	validator('json', (value, c) => {
		const parsed = kandinskySchema.safeParse(value);
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
				modelVersion: kandinskyVersion,
			},
		});
		kandinskyOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
