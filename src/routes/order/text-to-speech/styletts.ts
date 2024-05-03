import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { stylettsVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { stylettsSchema } from '../../../schemas/text-to-speech/styletts';
import styleTTSOrderQueue from '../../../services/queue/styletts-q';

export const createStylettsOrder = new Hono();

createStylettsOrder.post(
	'/styletts',
	validator('json', (value, c) => {
		const parsed = stylettsSchema.safeParse(value);
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
				modelVersion: stylettsVersion,
			},
		});
		styleTTSOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
