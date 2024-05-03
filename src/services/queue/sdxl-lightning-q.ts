import { Prisma } from '@prisma/client';
import { models } from '../../constants/models';
import prisma from '../../lib/db/prisma';
import { replicate } from '../../lib/generator/replicate';
import { getErrorMessage } from '../../lib/utils';

export default async function SDXLLightningOrderQueue() {
	// Check if the service is running
	if ((global as any).isSDXLLightningRunning) {
		console.log('The background generation operation is already running.');
		return;
	}

	// Runs the operation in the background
	console.log('///////////////////////////////');
	console.log('///////////////////////////////');
	console.log('Spinning up the background generation operation...');
	console.log('///////////////////////////////');
	(global as any).isSDXLLightningRunning = true;

	const processOrders = async () => {
		try {
			// Fetch the orders
			const orders = await prisma.predictions.findMany({
				where: {
					status: 'INQUEUE',
				},
				orderBy: {
					createdAt: 'asc',
				},
				take: 60,
			});

			if (orders.length === 0) {
				console.log('///////////////////////////////');
				console.log('Finished the background generation operation. length 0');
				console.log('///////////////////////////////');
				console.log('///////////////////////////////');
				(global as any).isSDXLLightningRunning = false;
				return;
			}

			// The image generation code goes here
			for (const order of orders) {
				// check defined model version against request model version
				const isExistingModel = models.find(model => {
					return model.version === order.modelVersion;
				});

				if (!isExistingModel) {
					// on Error
					await prisma.predictions.update({
						where: {
							id: order.id,
						},
						data: {
							status: 'FAILED',
						},
					});

					continue;
				}

				function parseJsonValue(json: Prisma.JsonValue): any {
					if (typeof json === 'string') {
						return JSON.parse(json);
					}
					return json;
				}
				await replicate.predictions.create({
					version: order.modelVersion,
					input: parseJsonValue(order.input),
					webhook: 'https://f108-154-192-194-78.ngrok-free.app/order/receive/' + order.id,
					webhook_events_filter: ['start', 'completed', 'output'],
				});

				await prisma.predictions.update({
					where: {
						id: order.id,
					},
					data: {
						status: 'STARTING',
					},
				});

				const d = new Date();
				const hh = d.getHours();
				const mm = d.getMinutes();
				const ss = d.getSeconds();
				console.log(
					`Created prediction at ${hh}:${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}`,
				);
			}

			setTimeout(processOrders, 500);
		} catch (err) {
			console.log(getErrorMessage(err));
			console.log('///////////////////////////////');
			console.log('Finished the background generation operation.');
			console.log('///////////////////////////////');
			console.log('///////////////////////////////');
			(global as any).isSDXLLightningRunning = false;
			return;
		}
	};

	processOrders();
}
