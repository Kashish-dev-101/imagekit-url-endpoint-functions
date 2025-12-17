/**
 * URL Endpoint Function Handler
 *
 * This is a default no-op handler that returns the URL unchanged.
 * Modify this function to implement your custom URL transformation logic.
 *
 * @param {string} url - Full request URL including protocol, hostname, path, and query string
 * @param {string} urlPrefix - Pattern identifier from client configuration
 * @param {object} context - Read-only request context
 * @param {string} context.host - Request hostname
 * @param {string} context.clientNumber - Client identifier
 * @param {boolean} context.isDebug - Debug mode flag
 * @param {object} context.logger - Request logger
 *
 * @returns {object} Result object with url and optional signURL flag
 */
// function handler(url, urlPrefix, context) {
//   // Default behavior: return URL unchanged without signing
//   return {
//     url: url,
//     signURL: false
//   };
// }

// module.exports.handler = handler;

// Example implementation: Rewrite /v1/ to /v2/ in the URL path

function handler(url, urlPrefix, context) {
  try {
    context.logger.info({ url, urlPrefix }, "Processing request");

    const modifiedUrl = rewriteV1ToV2(url);

    context.logger.info({ modifiedUrl }, "Transform complete");
    return { url: modifiedUrl };
  } catch (error) {
    context.logger.error({ error: error.message, url }, "Transform failed");
    return { url };
  }
}

function rewriteV1ToV2(url) {
  const parsedUrl = new URL(url);

  parsedUrl.pathname = parsedUrl.pathname.replace("/v1/", "/v2/");

  return parsedUrl.toString();
}

module.exports.handler = handler;
