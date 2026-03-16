/**
 * snap_user_images Path Rewriter
 *
 * Strips the `snap_user_images/` prefix from the URL path so that legacy
 * Cloudinary-style paths stored in the DB map correctly to S3 keys.
 *
 * DB / incoming path : snap_user_images/snap/{UUID}/{ID}
 * Rewritten path     : snap/{UUID}/{ID}
 * Actual S3 key      : snap/{UUID}/{ID}
 *
 * @param {string} url       - Full request URL including protocol, hostname, path, and query string
 * @param {string} urlPrefix - Pattern identifier from client configuration
 * @param {object} context   - Read-only request context
 * @returns {object}         - Result object with rewritten url
 */
function handler(url, urlPrefix, context) {
  try {
    context.logger.info(
      { url, urlPrefix },
      "Processing `snap_user_images rewrite",
    );

    const modifiedUrl = stripSnapUserImages(url);

    context.logger.info({ modifiedUrl }, "Rewrite complete");
    return { url: modifiedUrl };
  } catch (error) {
    context.logger.error({ error: error.message, url }, "Rewrite failed");
    return { url };
  }
}

function stripSnapUserImages(url) {
  const parsedUrl = new URL(url);

  parsedUrl.pathname = parsedUrl.pathname.replace(/\/snap_user_images\//, "/");

  return parsedUrl.toString();
}

module.exports.handler = handler;
