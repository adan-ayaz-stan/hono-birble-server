import { Hono } from "hono";
import { collectionInputSchema } from "../../schemas/collection-center";
import invokeCollectionImageOrderQueue from "../../services/queue/collections/image";
import { models } from "../../constants/models";
import prisma from "../../lib/db/prisma";
import { validator } from "hono/validator";

export const createCollectionOrderImage = new Hono();

createCollectionOrderImage.post(
  "/image",
  validator("json", (value, c) => {
    const parsed = collectionInputSchema.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid!", 400);
    }
    return parsed.data;
  }),
  async (c) => {
    // Handler goes here
    const body = c.req.valid("json");

    const isExistingModel = models.find((model) => {
      return model.version === body.modelVersion;
    });

    if (!isExistingModel) {
      return c.text("Invalid Model", 400);
    }

    // Create 100  orders

    await prisma.collectionPredictions.createMany({
      data: Array.from({ length: body.count }).map(() => {
        return {
          input: JSON.stringify(body),
          status: "INQUEUE",
          modelVersion: body.modelVersion,
          collectionId: body.collectionId,
          updatedAt: new Date(),
        };
      }),
    });

    //  Initiate Service Queue - Collection Images Queue
    invokeCollectionImageOrderQueue();

    // Response
    return c.json({ status: "INQUEUE", message: "Order created" }, 201);
  }
);
