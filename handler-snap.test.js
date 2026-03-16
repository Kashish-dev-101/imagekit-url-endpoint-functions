const { handler } = require("./handler-snap");

describe("snap_user_images Path Rewriter", () => {
  const mockContext = {
    host: "ik.imagekit.io",
    clientNumber: "test-client-123",
    isDebug: false,
    logger: {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should strip snap_user_images/ prefix from the path", () => {
    const url =
      "https://ik.imagekit.io/hme/snap_user_images/snap/0000014a-0604-11ef-a0c5-0242ac11001b/6589074";
    const urlPrefix = "hme";

    const result = handler(url, urlPrefix, mockContext);

    expect(result.url).toBe(
      "https://ik.imagekit.io/hme/snap/0000014a-0604-11ef-a0c5-0242ac11001b/6589074"
    );
    expect(mockContext.logger.error).not.toHaveBeenCalled();
  });

  it("should return the URL unchanged when snap_user_images/ is not present", () => {
    const url =
      "https://ik.imagekit.io/hme/snap/99036f5e-c928-11ed-8aca-0242ac110008/54990";
    const urlPrefix = "hme";

    const result = handler(url, urlPrefix, mockContext);

    expect(result.url).toBe(url);
    expect(mockContext.logger.error).not.toHaveBeenCalled();
  });

  it("should preserve query parameters after rewrite", () => {
    const url =
      "https://ik.imagekit.io/hme/snap_user_images/snap/e17f72f4-5ebb-11ee-a245-0242ac11000f/909319?tr=f-auto,q-auto";
    const urlPrefix = "hme";

    const result = handler(url, urlPrefix, mockContext);

    expect(result.url).toBe(
      "https://ik.imagekit.io/hme/snap/e17f72f4-5ebb-11ee-a245-0242ac11000f/909319?tr=f-auto,q-auto"
    );
  });

  it("should fallback to original URL if URL parsing fails", () => {
    const badUrl = "not a valid url";
    const urlPrefix = "hme";

    const result = handler(badUrl, urlPrefix, mockContext);

    expect(result.url).toBe(badUrl);
    expect(mockContext.logger.error).toHaveBeenCalled();
  });
});
