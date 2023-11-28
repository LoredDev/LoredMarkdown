// eslint-disable-next-line jsdoc/no-bad-blocks
/* eslint-disable
@typescript-eslint/no-unsafe-argument,
@typescript-eslint/no-unsafe-member-access,
@typescript-eslint/no-unsafe-assignment,
@typescript-eslint/no-unsafe-call,
*/

import process from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { parseHTML } from 'linkedom';

/** @type {string[]} */
const paths = process.argv
	.filter(a => a.endsWith('.inkscape.svg'))
	.map(a => (a.startsWith('/') ? a : path.join(process.cwd(), a)));

/**
 * @typedef {import('linkedom').HTMLElement} HTMLElement
 * @param {HTMLElement} el - The element to crawl on.
 * @param {(el: HTMLElement) => HTMLElement | void} callback
 * - Callback function to be run on each element.
 */
function crawl(el, callback) {
	for (const child of el.childNodes) {
		callback(child);
		if (child.nodeType === child.ELEMENT_NODE)
			crawl(child, callback);
	}
}

/**
 * @param {string} file - Files string to be converted.
 * @returns {string} - The converted file string content.
 */
function covert(file) {
	const { document } = parseHTML(file);
	// @ts-expect-error - because SVGElement is different from HTMLElement
	const el =/** @type {HTMLElement} */ (document.querySelector('svg'));

	crawl(el, (e) => {
		if (e.tagName === undefined || !e.hasAttributes()) return;

		/** @type {string | null } */
		const label = e.getAttribute('inkscape:label');
		if (!label)	return;

		e.setAttribute('data-banner-class', label);

		for (const attr of e.attributes) {
			// eslint-disable-next-line max-len
			if (attr.name.startsWith('inkscape:'))
				e.removeAttribute(attr.name);
			/* eslint-enable */
		}
	});

	const tmp = document.createElement('template');
	// @ts-expect-error el is type HTMLElement and not Node.
	tmp.appendChild(el);

	const capitalizedElements = [
		'linearGradient',
		'feFlood',
		'feGaussianBlur',
		'feOffset',
		'feComposite',
	];

	let htmlString = tmp.innerHTML;
	for (const e of capitalizedElements) {
		htmlString = htmlString.replaceAll(`<${e.toLowerCase()}`, `<${e}`);
		htmlString = htmlString.replaceAll(`</${e.toLowerCase()}`, `</${e}`);
	}

	return htmlString;
}

/* eslint-disable no-await-in-loop, security/detect-non-literal-fs-filename */
for (const p of paths) {
	const file = await fs.readFile(p);
	const svg = covert(file.toString());

	await fs.writeFile(p.replaceAll('.inkscape.svg', '.svg'), svg);
	// eslint-disable-next-line no-console
	console.log(`File ${p.replace(process.cwd(), '')} converted!`);
}

