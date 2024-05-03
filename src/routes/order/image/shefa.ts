import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { shefaVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import shefaOrderQueue from '../../../services/queue/shefa-q';
import { shefaSchema } from './../../../schemas/image/shefa';

export const createShefaOrder = new Hono();

createShefaOrder.post(
	'/shefa',
	validator('json', (value, c) => {
		const parsed = shefaSchema.safeParse(value);
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
				modelVersion: shefaVersion,
			},
		});
		shefaOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
