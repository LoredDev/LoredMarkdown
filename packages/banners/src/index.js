/**
 * @typedef {import('./index.js').BannerObject} BannerObject
 */
import getLocalLayout from './layouts.js';

/**
 * @param {Readonly<string>} string - The string to be converted.
 * @param {Document} document - The document API to be used.
 * @returns {Element} - The DOM of the string.
 */
function stringToHtml(string, document) {
	const tmp = document.createElement('template');
	tmp.innerHTML = string;
	/** @type {Element} */
	const dom = tmp.children[0];
	return dom;
}

/**
 * @param {Element} element - The element to be converted to string.
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
 * modify(query: string, callback: (el: Element | null) => T): T
 * }} DOMHelper
 * @param {Element} element - The element to be manipulated.
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
 * @typedef {{
 * getTranslate(): [number, number],
 * getFontSize(): { value: number, type: string },
 * }} RegexHelper
 * @param {Readonly<string>} string - The string to get values from.
 * @returns {RegexHelper}
 */
function regexHelper(string) {
	// TODO (@guz013) [>=1.0.0]: Prevent possible ReDoS attacks.
	/* eslint-disable security/detect-unsafe-regex */
	return {
		/**
		 * Gets the value from `font-size` of a style string.
		 * Returns 0px if none is found.
		 *
		 * @returns {{value: number, type: string}}
		 */
		getFontSize() {
			if (!string.includes('font-size'))
				return { type: 'px', value: 0 };

			const fontSizeRegex = /font-size:(?:[^;]+)/gu;
			const match = string.match(fontSizeRegex)?.[0].split(':')[1];

			const type = [...match ?? '']
				.filter(l => !'1234567890.'.includes(l))
				.join('');

			if (match) return { type, value: Number.parseFloat(match) };

			return { type: 'px', value: 0 };
		},
		/**
		 * Gets the `translate` x,y values from a transform string.
		 * Returns [0,0] if none is found.
		 *
		 * @returns {[number, number]}
		 */
		getTranslate() {
			if (!string.includes('translate')) return [ 0, 0 ];

			const translateRegex = /translate\((?:[^,]+),(?:[^)]+)\)/gu;

			const match = [...(string.match(translateRegex)?.[0] ?? '')]
				.filter(l => Number.parseFloat(l));

			return [
				Number.parseFloat(match[0] ?? '0'),
				Number.parseFloat(match[1] ?? '0'),
			];
		},
	};
	/* eslint-enable */
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
	const svg = await getLocalLayout('horizontal', true);

	const dom = stringToHtml(svg, doc);
	const helper = domHelper(dom);

	helper.modify('[data-banner-class="title"] > tspan', (el) => {
		if (!el) return;

		el.innerHTML = object.title;
		if (!object.subtitle) {
			const transform = el.parentElement?.getAttribute('transform');
			const coords = regexHelper(transform ?? '').getTranslate();
			coords[1] += 3;

			el.parentElement?.setAttribute('transform', `${transform ?? ''} translate(${coords.join(',')})`);


			const styles = el.getAttribute('style');
			const size = regexHelper(styles ?? '').getFontSize();

			el.setAttribute('style', `${styles};font-size:${size.value + 2}${size.type};`);
		}
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

