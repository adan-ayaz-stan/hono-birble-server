import { Hono } from "hono";
import { collectionRecieveOrder } from "./webhooks/collection/receive";
import { createAnimateDiffOrder } from "./routes/order/video/animate-diff";
import { createChampOrder } from "./routes/order/video/champ";
import { createCollectionOrderImage } from "./routes/collections/image";
import { createDreamshaperXLTurboOrder } from "./routes/order/image/dreamshaper-xl-turbo";
import { createFaceSwapOrder } from "./routes/order/image/crvc/face-swap";
import { createInstandIdOrder } from "./routes/order/image/crvc/instant-id";
import { createKandinskyOrder } from "./routes/order/image/kandinsky";
import { createLlava13bOrder } from "./routes/order/image/crvc/llava-13b";
import { createMusicgenOrder } from "./routes/order/music/musicgen";
import { createMustangoOrder } from "./routes/order/music/mustango";
import { createPhotomakerOrder } from "./routes/order/image/crvc/photomaker";
import { createPlaygroundOrder } from "./routes/order/image/playground";
import { createRealisticVisionImpatingOrder } from "./routes/order/image/crvc/realistic-vision-impainting";
import { createSdxlLightningOrder } from "./routes/order/image/sdxl-lightning";
import { createSdxlOrder } from "./routes/order/image/sdxl";
import { createShefaOrder } from "./routes/order/image/shefa";
import { createSongStarterOrder } from "./routes/order/music/songstarter";
import { createStableDiffusionInpaintingOrder } from "./routes/order/image/crvc/stable-diffusion-impainting";
import { createStylettsOrder } from "./routes/order/text-to-speech/styletts";
import { createTortoiseTtsOrder } from "./routes/order/text-to-speech/tortoise-tts";
import { createZeroscopeOrder } from "./routes/order/video/zeroscope";
import { logger } from "hono/logger";
import { predictionStatus } from "./routes/status/prediction";
import { receiveOrder } from "./webhooks/order/receive";
import { serve } from "@hono/node-server";

const app = new Hono();

app.use(logger());

//image routes
app.route("/order/os/image", createShefaOrder);
app.route("/order/os/image", createSdxlOrder);
app.route("/order/os/image", createSdxlLightningOrder);
app.route("/order/os/image", createPlaygroundOrder);
app.route("/order/os/image", createKandinskyOrder);
app.route("/order/os/image", createDreamshaperXLTurboOrder);
//creativity center image routes
app.route("/order/crvc/image", createInstandIdOrder);
app.route("/order/crvc/image", createPhotomakerOrder);
app.route("/order/crvc/image", createRealisticVisionImpatingOrder);
app.route("/order/crvc/image", createStableDiffusionInpaintingOrder);
app.route("/order/crvc/image", createFaceSwapOrder);
app.route("/order/crvc/image", createLlava13bOrder);
//music routes
app.route("/order/os/music", createMusicgenOrder);
app.route("/order/os/music", createMustangoOrder);
app.route("/order/os/music", createSongStarterOrder);
//text-to-speech routes
app.route("/order/os/tts", createStylettsOrder);
app.route("/order/os/tts", createTortoiseTtsOrder);
//video routes
app.route("/order/os/video", createChampOrder);
app.route("/order/os/video", createZeroscopeOrder);
app.route("/order/os/video", createAnimateDiffOrder);
// collection center routes
app.route("/collection/create", createCollectionOrderImage);
//status routes
app.route("/status", predictionStatus);
//webhooks
app.route("/", receiveOrder);
app.route("/", collectionRecieveOrder);

const port = 3000 || process.env.PORT;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
