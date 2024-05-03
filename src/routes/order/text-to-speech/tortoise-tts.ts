import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { tortoiseTtsVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { tortoiseTtsSchema } from '../../../schemas/text-to-speech/tortoise-tts';
import tortoiseTTSOrderQueue from '../../../services/queue/tortoise-tts-q';

export const createTortoiseTtsOrder = new Hono();

createTortoiseTtsOrder.post(
	'/tortoise-tts',
	validator('json', (value, c) => {
		const parsed = tortoiseTtsSchema.safeParse(value);
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
				modelVersion: tortoiseTtsVersion,
			},
		});
		tortoiseTTSOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
