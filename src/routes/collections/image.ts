import { Hono } from "hono";
import { validator } from "hono/validator";

export const createCollectionOrderImage = new Hono();

createCollectionOrderImage.post(
  "/",
  validator("json", (value, c) => {
    // Validator logic here
  }),
  async () => {
    // Handler goes here
  }
);
