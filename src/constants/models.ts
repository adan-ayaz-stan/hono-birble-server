import { ZodSchema } from 'zod';
import { dreamshaperXLTurboSchema } from '../schemas/image/dreamshaper-xl-turbo';
import { faceSwapSchema } from '../schemas/image/face-swap';
import { instandIdSchema } from '../schemas/image/instant-id';
import { kandinskySchema } from '../schemas/image/kandinsky';
import { llava13bSchema } from '../schemas/image/llava-13b';
import { photomakerSchema } from '../schemas/image/photomaker';
import { playgroundSchema } from '../schemas/image/playground';
import { realisticVisionImpatingSchema } from '../schemas/image/realistic-vision-impating';
import { SDXLSchema } from '../schemas/image/sdxl';
import { SDXLLightningSchema } from '../schemas/image/sdxl-lightning';
import { shefaSchema } from '../schemas/image/shefa';
import { stableDiffusionInpaintingSchema } from '../schemas/image/stable-diffusion-inpainting';
import { musicgenSchema } from '../schemas/music/musicgen';
import { mustangoSchema } from '../schemas/music/mustango';
import { songStarterSchema } from '../schemas/music/songstarter';
import { stylettsSchema } from '../schemas/text-to-speech/styletts';
import { tortoiseTtsSchema } from '../schemas/text-to-speech/tortoise-tts';
import { animateDiffSchema } from '../schemas/video/animate-diff';
import { champSchema } from '../schemas/video/champ';
import { zeroScopeSchema } from '../schemas/video/zeroscope';

// Schemas

export const models: { version: string; schema: ZodSchema; name: string }[] = [
	// ===================
	// Birble Image Models
	// ===================

	// Shefa Turbo
	{
		version: '85b256ceda2edad7d72ad740de2e168e512090f1dacf2f3a9b705b04c254254a',
		schema: shefaSchema,
		name: 'Shefa Turbo',
	},

	// Dreamshaper XL Turbo
	{
		version: '0a1710e0187b01a255302738ca0158ff02a22f4638679533e111082f9dd1b615',
		schema: dreamshaperXLTurboSchema,
		name: 'Dreamshaper XL Turbo',
	},

	// Kandinsky
	{
		version: '3c6374e7a9a17e01afe306a5218cc67de55b19ea536466d6ea2602cfecea40a9',
		schema: kandinskySchema,
		name: 'Kandinsky',
	},

	// Playground
	{
		version: 'a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24',
		schema: playgroundSchema,
		name: 'Playground',
	},

	// SDXL Lightning
	{
		version: '727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a',
		schema: SDXLLightningSchema,
		name: 'SDXL Lightning',
	},

	// SDXL
	{
		version: '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
		schema: SDXLSchema,
		name: 'SDXL',
	},

	// instant-id
	{
		version: '6af8583c541261472e92155d87bba80d5ad98461665802f2ba196ac099aaedc9',
		schema: instandIdSchema,
		name: 'Instant ID',
	},

	// photomaker
	{
		version: 'c748ca45b756a8b35e3c4e911ad33a8811d8e471035b7518b365b2348794d397',
		schema: photomakerSchema,
		name: 'Photomaker',
	},

	// realistic-vision-impating
	{
		version: '555a66628ea19a3b820d28878a0b0bfad222a814a7f12c79a83dbdbf57873213',
		schema: realisticVisionImpatingSchema,
		name: 'Realistic Vision Impating',
	},

	// stable-diffusion-inpainting
	{
		version: '95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3',
		schema: stableDiffusionInpaintingSchema,
		name: 'Stable Diffusion Inpainting',
	},

	// face-swap
	{
		version: 'c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe',
		schema: faceSwapSchema,
		name: 'Face Swap',
	},

	// llava-13b
	{
		version: 'b5f6212d032508382d61ff00469ddda3e32fd8a0e75dc39d8a4191bb742157fb',
		schema: llava13bSchema,
		name: 'Llava-13b',
	},

	// musicgen
	{
		version: '671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb',
		schema: musicgenSchema,
		name: 'Musicgen',
	},

	// styletts
	{
		version: '989cb5ea6d2401314eb30685740cb9f6fd1c9001b8940659b406f952837ab5ac',
		schema: stylettsSchema,
		name: 'Styletts',
	},

	// tortoise-tts
	{
		version: 'e9658de4b325863c4fcdc12d94bb7c9b54cbfe351b7ca1b36860008172b91c71',
		schema: tortoiseTtsSchema,
		name: 'Tortoise TTS',
	},

	// champ
	{
		version: '4b57a21012518a1a15cf70699df24f5bc75ed7a149fe06ebc04459e029315e1e',
		schema: champSchema,
		name: 'Champ',
	},

	// zero-scope
	{
		version: '9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
		schema: zeroScopeSchema,
		name: 'Zero-Scope',
	},

	// animate-diff
	{
		version: '269a616c8b0c2bbc12fc15fd51bb202b11e94ff0f7786c026aa905305c4ed9fb',
		schema: animateDiffSchema,
		name: 'Animate Diff',
	},

	// mustango
	{
		version: '1db0c525057769aff3b75995a89f84785f188e87afc090afaa7da7482fc1d3c4',
		schema: mustangoSchema,
		name: 'Mustango',
	},

	// songstarter
	{
		version: '020ac56a613f4494065e2e5544c7377788a8abcfbe645ecb8146634de0bc383e',
		schema: songStarterSchema,
		name: 'SongStarter',
	},
];

export const shefaVersion = models[0].version;

export const dreamshaperXLTurboVersion = models[1].version;

export const kandinskyVersion = models[2].version;

export const playgroundVersion = models[3].version;

export const sdxlLightningVersion = models[4].version;

export const sdxlVersion = models[5].version;

export const instantIdVersion = models[6].version;

export const photomakerVersion = models[7].version;

export const realisticVisionImpatingVersion = models[8].version;

export const stableDiffusionInpaintingVersion = models[9].version;

export const faceSwapVersion = models[10].version;

export const llava13bVersion = models[11].version;

export const musicgenVersion = models[12].version;

export const stylettsVersion = models[13].version;

export const tortoiseTtsVersion = models[14].version;

export const champVersion = models[15].version;

export const zeroScopeVersion = models[16].version;

export const animateDiffVersion = models[17].version;

export const mustangoVersion = models[18].version;

export const songStarterVersion = models[19].version;
