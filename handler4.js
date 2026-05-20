/**
 * Halton PDF Redirect Handler
 *
 * Intercepts requests to images.halton.com for PDF files under /app/uploads/
 * and issues a 301 redirect to www.halton.com with the same path and query string.
 * All other requests pass through unchanged.
 *
 * Rule: /app/uploads/*.pdf → 301 → https://www.halton.com (same path + query)
 *
 * @param {string} url - Full request URL including protocol, hostname, path, and query string
 * @param {string} urlPrefix - Pattern identifier from client configuration
 * @param {object} context - Read-only request context
 * @param {string} context.host - Request hostname
 * @param {string} context.clientNumber - Client identifier
 * @param {boolean} context.isDebug - Debug mode flag
 * @param {object} context.logger - Request logger
 *
 * @returns {object} Early 301 response for PDFs, or unchanged URL for everything else
 */
function handler(url, urlPrefix, context) {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;

    const match = path.match(/\/app\/uploads\/.+\.pdf$/i);

    if (match) {
      const cleanPath = match[0];
      context.logger.info({ path, cleanPath }, 'PDF redirect');
      return {
        status: 301,
        body: '',
        headers: {
          'Location': 'https://www.halton.com' + cleanPath + parsedUrl.search
        }
      };
    }

    return { url };
  } catch (error) {
    context.logger.error({ error: error.message, url }, 'Handler failed');
    return { url };
  }
}

module.exports.handler = handler;
