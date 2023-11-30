/**
 * @typedef {import('./index.js').BannerObject} BannerObject
 */
import getLocalLayout from './layouts.js';

/**
 * @param {Readonly<string>} string - The string to be converted.
 * @param {Document} document - The document API to be used.
 * @returns {HTMLElement} - The DOM of the string.
 */
function stringToHtml(string, document) {
	const tmp = document.createElement('template');
	tmp.innerHTML = string;
	/** @type {HTMLElement} */
	const dom = tmp.children[0];
	return dom;
}

/**
 * @param {HTMLElement} element - The element to be converted to string.
 * @param {Document} document - The document API to be used.
 * @returns {string} - The resulting string.
 */
function htmlToString(element, document) {
	const tmp = document.createElement('template');
	tmp.appendChild(element);
	return tmp.innerHTML;
}
/**
 * @typedef {{
 * modify(query: string, callback: (el: Element | null) => T) => T
 * }} DOMHelper
 * @param {HTMLElement} element - The element to be manipulated.
 * @returns {DOMHelper}
 */
function domHelper(element) {
	return {
		/**
		 * @template T
		 * @param {string} query - The query selector to find the element.
		 * @param {(el: Element | null) => T} callback - Callback to modify the element.
		 * @returns {T} - The return value of the callback.
		 * @throws {Error} - Throws if the element is not found.
		 */
		modify(query, callback) {
			const el = element.querySelector(query);

			return callback(el);
		},
	};
}

/**
 * @param {BannerObject} object - The Banner Object to be generated from.
 * @returns {Promise<string>} - The SVG of the banner.
 */
async function banner(object) {
	/** @type {Document} */
	// @ts-expect-error because Document is not compatible with Readonly<Document>
	const doc = object.lib?.document ?? globalThis.document;
	/** @type {Readonly<string>} */
	const svg = await getLocalLayout('vertical');

	const dom = stringToHtml(svg, doc);
	const helper = domHelper(dom);

	helper.modify('[data-banner-class="title"] > tspan', (el) => {
		if (!el) return;

		el.innerHTML = object.title;
	});
	helper.modify('[data-banner-class="subtitle"] > tspan', (el) => {
		if (!el) return;
		el.innerHTML = object.subtitle ?? '';
	});
	return htmlToString(dom, doc);
}
/**
 * Test function.
 */
async function test() {
	const testBanner = await banner({
		lib: {
			// @ts-expect-error because Document is not DeepReadonly<Document>
			document: new Document(),
			fetch,
		},
		title: 'Hello, world',
	});

	const body = globalThis.document.getElementsByTagName('body')[0];
	body.innerHTML = testBanner;
}
await test();

export default banner;

