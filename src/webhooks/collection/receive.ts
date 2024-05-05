import { Context, Hono } from "hono";

import { HTTPException } from "hono/http-exception";
import cloudinary from "../../lib/storage/cloudinary";
import crypto from "crypto";
import { getErrorMessage } from "../../lib/utils";
import { predictionSchema } from "../../schemas/prediction";
import prisma from "../../lib/db/prisma";
import { validator } from "hono/validator";

export const collectionRecieveOrder = new Hono();

async function verifySignature(c: Context) {
  const webhookId = c.req.header("webhook-id");
  const webhookTimestamp = c.req.header("webhook-timestamp");
  const webhookSignature = c.req.header("webhook-signature");

  const webhookSecret = process.env.REPLICATE_WEBHOOK_SECRET;

  if (!webhookId || !webhookTimestamp || !webhookSignature || !webhookSecret) {
    console.log("Parameters missing");
    return false;
  }

  const signedContent = `${webhookId}.${webhookTimestamp}.${
    (await c.req.raw.body) || ""
  }`;
  // Base64 decode the secret
  const secretBytes = new Buffer(webhookSecret.split("_")[1], "base64");
  const signature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  return signature === (webhookSignature as string).split(",")[1];
}

collectionRecieveOrder.post(
  "collection/receive/:collectionId/:orderId",
  validator("json", (value, c) => {
    const parsed = predictionSchema.safeParse(value);
    if (!parsed.success) {
      return c.text(parsed.error.message, 401);
    }
    return parsed.data;
  }),
  async (c) => {
    if (!verifySignature(c)) {
      console.log("Invalid webhook signature");
      return c.json({ message: "Invalid webhook signature" }, 403);
    }

    const collectionId = c.req.param("collectionId");
    const orderId = c.req.param("orderId");

    if (!collectionId || !orderId) {
      console.log("Missing id");
      throw new HTTPException(400, { message: `Missing id` });
    }
    try {
      const body = c.req.valid("json");

      switch (body.status) {
        case "processing":
          await prisma.collectionPredictions.update({
            where: {
              id: orderId,
            },
            data: {
              status: "PROCESSING",
            },
          });
          break;

        case "succeeded":
          const processed_output =
            typeof body.output == "string" ? body.output : body.output[0];

          const collection = await prisma.collections.findUniqueOrThrow({
            where: {
              id: collectionId,
            },
          });

          const cloudinaryResponse = await cloudinary.uploader.upload(
            processed_output,
            {
              folder:
                "users/" +
                collection?.userId +
                "/collections/" +
                collection?.id,
            }
          );

          // Register as normal image generation
          const image = await prisma.images.create({
            data: {
              userId: collection?.userId,
              url: cloudinaryResponse.url,
              secureUrl: cloudinaryResponse.secure_url,
              prompt: body.input.prompt,
              bytes: cloudinaryResponse.bytes,
              format: cloudinaryResponse.format,
              resourceType: cloudinaryResponse.resource_type,
              originalFilename: cloudinaryResponse.original_filename,
              publicId: cloudinaryResponse.public_id,
              public: false,
              width: cloudinaryResponse.width,
              height: cloudinaryResponse.height,
              updatedAt: new Date(),
            },
          });

          // Create collection media
          const collectionMedia = await prisma.collectionMedia.create({
            data: {
              collection_id: collectionId,
              name: collection.name,
              count_id: collection.count + 1,
              userId: collection.userId,
              media_id: image.id,
              media_url: image.url,
            },
          });

          // Create metadata
          await prisma.metadataMedia.create({
            data: {
              collection_media_id: collectionMedia.id,
              description: body.input.prompt,
              media_url: image.url,
              name: collection.name + " #" + (collection.count + 1),
              userId: collection.userId,
              author: collection.userId,
            },
          });

          await prisma.collectionPredictions.update({
            where: {
              id: orderId,
            },
            data: {
              status: "SUCCESS",
              output: processed_output,
            },
          });

          console.log(
            "Collection Media generated with id: ",
            collectionMedia.id
          );
          break;

        case "failed":
          await prisma.collectionPredictions.update({
            where: {
              id: orderId,
            },
            data: {
              status: "FAILED",
            },
          });
          break;

        default:
          break;
      }

      return c.json({ message: "Webhook received" }, 200);
    } catch (err) {
      console.log("Error in receiveOrder:", err);
      console.log("Error in receiveOrder:", getErrorMessage(err));
      return c.json({ message: "Error in receiveOrder" }, 500);
    }
  }
);
