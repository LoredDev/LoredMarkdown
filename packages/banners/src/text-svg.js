import * as typr from '@fredli74/typr';

const buffer = await fetch(
	import.meta.resolve('/packages/banners/static/CalSans-SemiBold.ttf'),
);
const font = new typr.Font(await buffer.arrayBuffer());
const glyhps = font.stringToGlyphs('Hello world');

const path = font.glyphsToPath(glyhps);
const svg = font.pathToSVG(path);

export default svg;


