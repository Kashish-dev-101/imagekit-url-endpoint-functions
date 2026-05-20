const { handler } = require('./handler4');

const mockContext = {
  host: 'images.halton.com',
  clientNumber: 'halton',
  isDebug: false,
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }
};

describe('Halton PDF redirect handler', () => {

  it('redirects a PDF in /app/uploads/ with no query string', () => {
    const url = 'https://images.halton.com/app/uploads/2022/02/HaltonFS_Catalogue_2017-KR.pdf';
    const result = handler(url, '/', mockContext);
    expect(result.status).toBe(301);
    expect(result.headers['Location']).toBe('https://www.halton.com/app/uploads/2022/02/HaltonFS_Catalogue_2017-KR.pdf');
  });

  it('redirects a PDF and preserves query string', () => {
    const url = 'https://images.halton.com/app/uploads/2021/10/report.pdf?tr=f-auto,q-85,w-600';
    const result = handler(url, '/', mockContext);
    expect(result.status).toBe(301);
    expect(result.headers['Location']).toContain('https://www.halton.com/app/uploads/2021/10/report.pdf');
    expect(result.headers['Location']).toContain('tr=');
  });

  it('strips any IK prefix before /app/uploads/ in the redirect Location', () => {
    const url = 'https://images.halton.com/halton-ik-id/app/uploads/2022/02/report.pdf';
    const result = handler(url, '/', mockContext);
    expect(result.status).toBe(301);
    expect(result.headers['Location']).toBe('https://www.halton.com/app/uploads/2022/02/report.pdf');
  });

  it('redirects PDF with uppercase extension (.PDF)', () => {
    const url = 'https://images.halton.com/app/uploads/2022/02/Manual.PDF';
    const result = handler(url, '/', mockContext);
    expect(result.status).toBe(301);
    expect(result.headers['Location']).toContain('https://www.halton.com/app/uploads/2022/02/Manual.PDF');
  });

  it('does NOT redirect a regular image (avif)', () => {
    const url = 'https://images.halton.com/app/uploads/2020/06/iStock-916456338-1.avif';
    const result = handler(url, '/', mockContext);
    expect(result.url).toBe(url);
    expect(result.status).toBeUndefined();
  });

  it('does NOT redirect a path with pdf in folder name but image extension', () => {
    const url = 'https://images.halton.com/app/uploads/pdf-guides/cover.jpg';
    const result = handler(url, '/', mockContext);
    expect(result.url).toBe(url);
    expect(result.status).toBeUndefined();
  });

  it('does NOT redirect a PDF outside /app/uploads/', () => {
    const url = 'https://images.halton.com/downloads/brochure.pdf';
    const result = handler(url, '/', mockContext);
    expect(result.url).toBe(url);
    expect(result.status).toBeUndefined();
  });

});
