import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { llava13bVersion } from '../../../../constants/models';
import prisma from '../../../../lib/db/prisma';
import { llava13bSchema } from '../../../../schemas/image/llava-13b';
import llavaOrderQueue from '../../../../services/queue/llava-13b-q';

export const createLlava13bOrder = new Hono();

createLlava13bOrder.post(
	'/llava-13b',
	validator('json', (value, c) => {
		const parsed = llava13bSchema.safeParse(value);
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
				modelVersion: llava13bVersion,
			},
		});
		llavaOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
