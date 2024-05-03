import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { sdxlVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { SDXLSchema } from '../../../schemas/image/sdxl';
import SDXLOrderQueue from '../../../services/queue/sdxl-q';

export const createSdxlOrder = new Hono();

createSdxlOrder.post(
	'/sdxl',
	validator('json', (value, c) => {
		const parsed = SDXLSchema.safeParse(value);
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
				modelVersion: sdxlVersion,
			},
		});
		SDXLOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
