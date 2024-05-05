import { Prisma } from "@prisma/client";
import { getErrorMessage } from "../../../lib/utils";
import { models } from "../../../constants/models";
import prisma from "../../../lib/db/prisma";
import { replicate } from "../../../lib/generator/replicate";

export default async function invokeCollectionImageOrderQueue() {
  // Check if the service is running
  if ((global as any).isCollectionImageRunning) {
    console.log("The background generation operation is already running.");
    return;
  }

  // Runs the operation in the background
  console.log("///////////////////////////////");
  console.log("///////////////////////////////");
  console.log("Spinning up the background generation operation...");
  console.log("///////////////////////////////");
  (global as any).isCollectionImageRunning = true;

  const processOrders = async () => {
    try {
      // Fetch the orders
      const orders = await prisma.collectionPredictions.findMany({
        where: {
          status: "INQUEUE",
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 60,
      });

      if (orders.length === 0) {
        console.log("///////////////////////////////");
        console.log("Finished the background generation operation. length 0");
        console.log("///////////////////////////////");
        console.log("///////////////////////////////");
        (global as any).isCollectionImageRunning = false;
        return;
      }

      // The image generation code goes here
      for (const order of orders) {
        // check defined model version against request model version
        const isExistingModel = models.find((model) => {
          return model.version === order.modelVersion;
        });

        if (!isExistingModel) {
          // on Error
          await prisma.collectionPredictions.update({
            where: {
              id: order.id,
            },
            data: {
              status: "FAILED",
            },
          });

          continue;
        }

        function parseJsonValue(json: Prisma.JsonValue): any {
          if (typeof json === "string") {
            return JSON.parse(json);
          }
          return json;
        }

        const orderData = parseJsonValue(order.input);

        await replicate.predictions.create({
          version: order.modelVersion,
          input: orderData,
          webhook:
            "https://556b-34-118-255-242.ngrok-free.app/collection/receive/" +
            order.collectionId +
            "/" +
            order.id,
          webhook_events_filter: ["start", "completed", "output"],
        });

        await prisma.collectionPredictions.update({
          where: {
            id: order.id,
          },
          data: {
            status: "STARTING",
          },
        });

        const d = new Date();
        const hh = d.getHours();
        const mm = d.getMinutes();
        const ss = d.getSeconds();
        console.log(
          `Created prediction at ${hh}:${mm < 10 ? "0" + mm : mm}:${
            ss < 10 ? "0" + ss : ss
          }`
        );
      }

      setTimeout(processOrders, 500);
    } catch (err) {
      console.log(getErrorMessage(err));
      console.log("///////////////////////////////");
      console.log("Finished the background generation operation.");
      console.log("///////////////////////////////");
      console.log("///////////////////////////////");
      (global as any).isCollectionImageRunning = false;
      return;
    }
  };

  processOrders();
}
