import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { instantIdVersion } from '../../../../constants/models';
import prisma from '../../../../lib/db/prisma';
import { instandIdSchema } from '../../../../schemas/image/instant-id';
import instantIdOrderQueue from '../../../../services/queue/instant-id-q';

export const createInstandIdOrder = new Hono();

createInstandIdOrder.post(
	'/instant-id',
	validator('json', (value, c) => {
		const parsed = instandIdSchema.safeParse(value);
		if (!parsed.success) {
			return c.text('Invalid!', 401);
		}
		return parsed.data;
	}),
	async c => {
		const body = c.req.valid('json');

		const prediction = await prisma.predictions.create({
			data: {
				input: JSON.stringify(body),
				status: 'INQUEUE',
				modelVersion: instantIdVersion,
			},
		});
		instantIdOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
