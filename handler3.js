/**
 * URL Endpoint Function Handler 3
 *
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

function handler(url, urlPrefix, context) {
  try {
    context.logger.info({ url, urlPrefix }, "Processing request");

    const modifiedUrl = transformProductImage(url);

    context.logger.info({ modifiedUrl }, "Transform complete");
    return { url: modifiedUrl };
  } catch (error) {
    context.logger.error({ error: error.message, url }, "Transform failed");
    return { url };
  }
}

function transformProductImage(url) {
  const parsedUrl = new URL(url);

  // Guard 1: only run for the intended folder structure
  const legacyPrefix = "/autoenlinea/imgjpg/";
  if (!parsedUrl.pathname.startsWith(legacyPrefix)) {
    return parsedUrl.toString();
  }

  const pathParts = parsedUrl.pathname.split("/");
  const fileName = pathParts[pathParts.length - 1]; // keep it, do not pop yet

  // Guard 2: only rewrite if filename matches digits_digits.jpg
  // Examples allowed: 019694_1.jpg, 123_9.jpg
  const match = /^(\d+)_\d+\.jpg$/i.exec(fileName);
  if (!match) {
    return parsedUrl.toString();
  }

  const baseId = match[1]; // the digits before underscore
  const newFileName = `${baseId}_000_001.jpg`;

  // Replace last part with products/new filename
  pathParts[pathParts.length - 1] = "products";
  pathParts.push(newFileName);

  parsedUrl.pathname = pathParts.join("/");

  return parsedUrl.toString();
}

module.exports.handler = handler;
