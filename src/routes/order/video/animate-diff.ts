import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { animateDiffVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { animateDiffSchema } from '../../../schemas/video/animate-diff';
import animateDiffOrderQueue from '../../../services/queue/animate-diff-q';

export const createAnimateDiffOrder = new Hono();

createAnimateDiffOrder.post(
	'/animate-diff',
	validator('json', (value, c) => {
		const parsed = animateDiffSchema.safeParse(value);
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
				modelVersion: animateDiffVersion,
			},
		});
		animateDiffOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
