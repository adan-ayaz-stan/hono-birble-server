import { Hono } from "hono";
import { validator } from "hono/validator";

export const createCollectionOrderVideo = new Hono();

createCollectionOrderVideo.post(
  "/",
  validator("json", (value, c) => {
    // Validator logic here
  }),
  async () => {
    // Handler goes here
  }
);
