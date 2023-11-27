import { configs, defineConfig, presets } from '@eslegant/js';

export default defineConfig([
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	...presets.strict,
	configs.environments.node.strict.default,
]);

