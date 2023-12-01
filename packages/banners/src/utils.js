
/**
 * Checks if a given string is a URL.
 *
 * @param {Readonly<string>} string - The string to be checked.
 * @returns {boolean}
 */
function isURL(string) {
	try {
		const url = new URL(string);

		return url.protocol === 'http' || url.protocol === 'https';
	}
	catch {
		return false;
	}
}

/**
 * Checks if a given string is a valid Iconify's icon name.
 *
 * @param {string} string - The string to be checked.
 * @returns {boolean}
 */
function isValidIcon(string) {
	if (string.includes('--')) return false;

	// eslint-disable-next-line no-secrets/no-secrets
	const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyz1234567890-:';
	if ([...string].some(l => !VALID_CHARS.includes(l)))
		return false;

	if (!string.includes(':')) return false;

	return true;
}

export { isURL, isValidIcon };

