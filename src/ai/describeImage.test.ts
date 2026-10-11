import { describeImage } from './describeImage';

jest.mock('@/images/processImage', () => ({
  resizeForApi: jest.fn(async (path: string) => path),
}));

jest.mock('expo-file-system', () => ({
  File: class {
    async base64() {
      return 'cXg=';
    }
  },
}));

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

function okResponse(content: unknown): Response {
  return {
    ok: true,
    json: async () => ({ choices: [{ message: { content } }] }),
  } as unknown as Response;
}

function lastRequestBody(): {
  model: string;
  messages: { content: Record<string, unknown>[] }[];
} {
  const init = fetchMock.mock.calls[0][1] as RequestInit;
  return JSON.parse(init.body as string);
}

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue(okResponse('  Apple pie.  '));
});

describe('describeImage', () => {
  it('sends the image to OpenRouter with the API key and the default tier model', async () => {
    const description = await describeImage('/img/meal.jpg', 'test-key');

    expect(description).toBe('Apple pie.');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(OPENROUTER_URL);
    expect(init.headers).toMatchObject({ Authorization: 'Bearer test-key' });

    const body = lastRequestBody();
    expect(body.model).toBe('google/gemini-3-flash-preview');
    const imagePart = body.messages[0].content.find((p) => p.type === 'image_url');
    expect(imagePart).toMatchObject({ image_url: { url: 'data:image/jpeg;base64,cXg=' } });
  });

  it('uses the model belonging to the requested tier', async () => {
    await describeImage('/img/meal.jpg', 'test-key', 'free');
    expect(lastRequestBody().model).toBe('google/gemma-4-31b-it:free');
  });

  it('appends the requested language to the prompt', async () => {
    await describeImage('/img/meal.jpg', 'test-key', 'normal', 'es');
    const textPart = lastRequestBody().messages[0].content.find((p) => p.type === 'text');
    expect(textPart?.text).toMatch(/ Respond in Spanish\.$/);
  });

  it('throws on a non-ok response', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 } as unknown as Response);
    await expect(describeImage('/img/meal.jpg', 'test-key')).rejects.toThrow(
      'OpenRouter error: 500',
    );
  });

  it('throws on an unexpected response shape', async () => {
    fetchMock.mockResolvedValue(okResponse(42));
    await expect(describeImage('/img/meal.jpg', 'test-key')).rejects.toThrow(
      'Unexpected response shape from OpenRouter',
    );
  });
});
