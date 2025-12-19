const { handler } = require("./handler3");

describe("URL Endpoint Function Handler 3", () => {
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

  it("should transform legacy product image URL to products format", () => {
    const url = "https://ik.imagekit.io/autoenlinea/imgjpg/019694_1.jpg";
    const urlPrefix = "/";

    const result = handler(url, urlPrefix, mockContext);

    expect(result.url).toBe(
      "https://ik.imagekit.io/autoenlinea/imgjpg/products/019694_000_001.jpg"
    );
    expect(mockContext.logger.error).not.toHaveBeenCalled();
  });

  it("should return original URL if filename does not match expected pattern", () => {
    const url = "https://ik.imagekit.io/autoenlinea/imgjpg/random.jpg";
    const urlPrefix = "/";

    const result = handler(url, urlPrefix, mockContext);

    expect(result.url).toBe(url);
    expect(mockContext.logger.error).not.toHaveBeenCalled();
  });

  it("should return original URL if URL structure is different", () => {
    const url = "https://ik.imagekit.io/autoenlinea/otherfolder/019694_1.jpg";
    const urlPrefix = "/";

    const result = handler(url, urlPrefix, mockContext);

    expect(result.url).toBe(url);
    expect(mockContext.logger.error).not.toHaveBeenCalled();
  });

  it("should fallback safely if URL parsing fails", () => {
    const badUrl = "not-a-valid-url";
    const urlPrefix = "/";

    const result = handler(badUrl, urlPrefix, mockContext);

    expect(result.url).toBe(badUrl);
    expect(mockContext.logger.error).toHaveBeenCalled();
  });
});
