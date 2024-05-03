import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { sdxlLightningVersion } from '../../../constants/models';
import prisma from '../../../lib/db/prisma';
import { SDXLLightningSchema } from '../../../schemas/image/sdxl-lightning';
import SDXLLightningOrderQueue from '../../../services/queue/sdxl-lightning-q';

export const createSdxlLightningOrder = new Hono();

createSdxlLightningOrder.post(
	'/sdxl-lightning',
	validator('json', (value, c) => {
		const parsed = SDXLLightningSchema.safeParse(value);
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
				modelVersion: sdxlLightningVersion,
			},
		});
		SDXLLightningOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
