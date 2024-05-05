import { Hono } from "hono";
import { validator } from "hono/validator";

export const createCollectionOrderMusic = new Hono();

createCollectionOrderMusic.post(
  "/",
  validator("json", (value, c) => {
    // Validator logic here
  }),
  async () => {
    // Handler goes here
  }
);
