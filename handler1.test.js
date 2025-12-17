const { handler } = require("./handler1");

describe("URL Endpoint Function Handler", () => {
  // Mock context object for testing
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

  // it('should return the original URL unchanged', () => {
  //   const url = 'https://ik.imagekit.io/demo/image.jpg';
  //   const urlPrefix = '/';

  //   const result = handler(url, urlPrefix, mockContext);

  //   expect(result.url).toBe(url);
  //   expect(result.signURL).toBe(false);
  // });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should rewrite /v1/ to /v2/ in the pathname", () => {
    const url = "https://ik.imagekit.io/demo/v1/image.jpg";
    const urlPrefix = "demo";

    const result = handler(url, urlPrefix, mockContext);

    expect(result.url).toBe("https://ik.imagekit.io/demo/v2/image.jpg");
    expect(result.signURL).toBeUndefined();
    expect(mockContext.logger.error).not.toHaveBeenCalled();
  });

  it("should return the original URL unchanged when /v1/ is not present", () => {
    const url = "https://ik.imagekit.io/demo/image.jpg";
    const urlPrefix = "demo";

    const result = handler(url, urlPrefix, mockContext);

    expect(result.url).toBe(url);
    expect(result.signURL).toBeUndefined();
    expect(mockContext.logger.error).not.toHaveBeenCalled();
  });

  it("should fallback to original URL if URL parsing fails", () => {
    const badUrl = "not a valid url";
    const urlPrefix = "demo";

    const result = handler(badUrl, urlPrefix, mockContext);

    expect(result.url).toBe(badUrl);
    expect(mockContext.logger.error).toHaveBeenCalled();
  });
});
