import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { musicgenVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { musicgenSchema } from '../../../schemas/music/musicgen';
import musicgenOrderQueue from '../../../services/queue/musicgen-q';

export const createMusicgenOrder = new Hono();

createMusicgenOrder.post(
	'/musicgen',
	validator('json', (value, c) => {
		const parsed = musicgenSchema.safeParse(value);
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
				modelVersion: musicgenVersion,
			},
		});
		musicgenOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
