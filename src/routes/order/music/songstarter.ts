import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { songStarterVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { songStarterSchema } from '../../../schemas/music/songstarter';
import songStarterOrderQueue from '../../../services/queue/songstarter-q';

export const createSongStarterOrder = new Hono();

createSongStarterOrder.post(
	'/songstarter',
	validator('json', (value, c) => {
		const parsed = songStarterSchema.safeParse(value);
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
				modelVersion: songStarterVersion,
			},
		});
		songStarterOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
