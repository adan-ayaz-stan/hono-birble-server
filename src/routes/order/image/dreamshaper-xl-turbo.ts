import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { dreamshaperXLTurboVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { dreamshaperXLTurboSchema } from '../../../schemas/image/dreamshaper-xl-turbo';
import dreamshaperOrderQueue from '../../../services/queue/dreamshaper-q';

export const createDreamshaperXLTurboOrder = new Hono();

createDreamshaperXLTurboOrder.post(
	'/dreamshaper-xl-turbo',
	validator('json', (value, c) => {
		const parsed = dreamshaperXLTurboSchema.safeParse(value);
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
				modelVersion: dreamshaperXLTurboVersion,
			},
		});
		dreamshaperOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
