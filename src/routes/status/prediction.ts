import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import prisma from '../../lib/db/prisma';

export const predictionStatus = new Hono();

predictionStatus.get('/prediction/:id', async c => {
	const id = c.req.param('id');

	const prediction = await prisma.predictions.findUnique({
		where: { id },
		select: {
			id: true,
			status: true,
			output: true,
		},
	});

	if (!prediction) {
		throw new HTTPException(404, { message: `Prediction with ID ${id} not found` });
	}

	return c.json(prediction, 200);
});
