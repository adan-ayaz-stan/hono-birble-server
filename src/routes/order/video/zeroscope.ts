import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { zeroScopeVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { zeroScopeSchema } from '../../../schemas/video/zeroscope';
import zeroScopeOrderQueue from '../../../services/queue/zeroscope-q';

export const createZeroscopeOrder = new Hono();

createZeroscopeOrder.post(
	'/zeroscope',
	validator('json', (value, c) => {
		const parsed = zeroScopeSchema.safeParse(value);
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
				modelVersion: zeroScopeVersion,
			},
		});
		zeroScopeOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
