const handler = require('./handler');

describe('URL Endpoint Function Handler', () => {
  // Mock context object for testing
  const mockContext = {
    host: 'ik.imagekit.io',
    clientNumber: 'test-client-123',
    isDebug: false,
    logger: {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    }
  };

  it('should replace /v1/ with /v2/ in the URL', () => {
    const url = 'https://ik.imagekit.io/demo/v1/image.jpg';
    const urlPrefix = 'demo';
    
    const result = handler(url, urlPrefix, mockContext);
    
    expect(result.url).toBe('https://ik.imagekit.io/demo/v2/image.jpg');
    expect(result.signURL).toBe(false);
  });
});
