import { configs, defineConfig, presets } from '@eslegant/js';

export default defineConfig([
	{
		ignores: ['**/*.svg.js'],
	},
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	...presets.strict,
	configs.environments.node.strict.default,
]);

