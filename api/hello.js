/**
 * @typedef {import('@vercel/node').VercelRequest} VRequest
 * @typedef {import('@vercel/node').VercelResponse} VResponse
 */

/**
 * @param {VRequest} req - Request object.
 * @param {VResponse} res - Response object.
 * @returns {VResponse}
 */
export default function handler(req, res) {
	return res.status(200).json({ text: 'Hello from api!' });
}

