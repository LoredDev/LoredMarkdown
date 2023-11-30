
/**
 * Imports a local layout from the static folder.
 *
 * @param {import('./types.d.ts').BuiltinLayouts} layout - The banner layout.
 * @param {boolean} [rtl] - Is the layout right-to-left?
 * @returns {Promise<string>} - The SVG string of the layout file.
 */
async function getLocalLayout(layout, rtl = false) {
	let layoutFile;
	/* eslint-disable import/no-relative-parent-imports */
	switch (layout) {
		case 'vertical': {
			layoutFile = await import('../static/vertical.svg.js');
			break;
		}
		default: {
			if (rtl)
				layoutFile = await import('../static/horizontal-rtl.svg.js');
			layoutFile = await import('../static/horizontal.svg.js');
		}
	}
	/* eslint-enable */

	return layoutFile.default;
}
export default getLocalLayout;
