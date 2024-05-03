import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { faceSwapVersion } from '../../../../constants/models';
import prisma from '../../../../lib/db/prisma';
import { faceSwapSchema } from '../../../../schemas/image/face-swap';
import faceSwapOrderQueue from '../../../../services/queue/face-swap-q';

export const createFaceSwapOrder = new Hono();

createFaceSwapOrder.post(
	'/face-swap',
	validator('json', (value, c) => {
		const parsed = faceSwapSchema.safeParse(value);
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
				modelVersion: faceSwapVersion,
			},
		});
		faceSwapOrderQueue();
		return c.json({ id: prediction.id, status: 'INQUEUE', message: 'Order created' }, 201);
	},
);
