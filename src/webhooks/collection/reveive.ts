import crypto from 'crypto';
import { Context, Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import prisma from '../../lib/db/prisma';
import { getErrorMessage } from '../../lib/utils';
import { predictionSchema } from '../../schemas/prediction';

export const receiveOrder = new Hono();

async function verifySignature(c: Context) {
	const webhookId = c.req.header('webhook-id');
	const webhookTimestamp = c.req.header('webhook-timestamp');
	const webhookSignature = c.req.header('webhook-signature');

	const webhookSecret = process.env.REPLICATE_WEBHOOK_SECRET;

	if (!webhookId || !webhookTimestamp || !webhookSignature || !webhookSecret) {
		console.log('Parameters missing');
		return false;
	}

	const signedContent = `${webhookId}.${webhookTimestamp}.${(await c.req.raw.body) || ''}`;
	// Base64 decode the secret
	const secretBytes = new Buffer(webhookSecret.split('_')[1], 'base64');
	const signature = crypto.createHmac('sha256', secretBytes).update(signedContent).digest('base64');

	return signature === (webhookSignature as string).split(',')[1];
}

receiveOrder.post(
	'collection/receive/:id',
	validator('json', (value, c) => {
		const parsed = predictionSchema.safeParse(value);
		if (!parsed.success) {
			return c.text('Invalid!', 401);
		}
		return parsed.data;
	}),
	async c => {
		if (!verifySignature(c)) {
			console.log('Invalid webhook signature');
			return c.json({ message: 'Invalid webhook signature' }, 403);
		}

		const id = c.req.param('id');

		if (!id) {
			console.log('Missing id');
			throw new HTTPException(400, { message: `Missing id` });
		}
		try {
			const body = c.req.valid('json');

			switch (body.status) {
				case 'processing':
					await prisma.predictions.update({
						where: {
							id,
						},
						data: {
							status: 'PROCESSING',
						},
					});
					break;

				case 'succeeded':
					const processed_output = typeof body.output == 'string' ? body.output : body.output[0];

					await prisma.predictions.update({
						where: {
							id,
						},
						data: {
							status: 'SUCCESS',
							output: processed_output,
						},
					});
					break;

				case 'failed':
					await prisma.predictions.update({
						where: {
							id,
						},
						data: {
							status: 'FAILED',
						},
					});
					break;

				default:
					break;
			}

			return c.json({ message: 'Webhook received' }, 200);
		} catch (err) {
			console.log('Error in receiveOrder:', getErrorMessage(err));
			return c.json({ message: 'Error in receiveOrder' }, 500);
		}
	},
);
