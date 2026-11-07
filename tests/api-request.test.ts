import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { apiRequest } from '../src/tools/api/index.js';

const API_URL =
  'https://jsonplaceholder.typicode.com/todos/1';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('api_request', () => {
  it('returns a successful JSON response', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          title: 'Test task',
          completed: false,
        }),
        { status: 200 },
      ),
    );

    vi.stubGlobal('fetch', mockFetch);

    const result = await apiRequest(API_URL);

    expect(result.status).toBe(200);
    expect(result.ok).toBe(true);
    expect(result.body).toEqual({
      id: 1,
      title: 'Test task',
      completed: false,
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      API_URL,
      expect.objectContaining({
        method: 'GET',
        redirect: 'error',
      }),
    );
  });

  it('returns HTTP 404 without throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('{}', { status: 404 }),
      ),
    );

    const result = await apiRequest(API_URL);

    expect(result.status).toBe(404);
    expect(result.ok).toBe(false);
  });

  it('rejects requests to unauthorized domains', async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    await expect(
      apiRequest('https://example.com'),
    ).rejects.toThrow('Only HTTPS requests');

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('propagates HTTP execution errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(
        new Error('Request timed out'),
      ),
    );

    await expect(
      apiRequest(API_URL),
    ).rejects.toThrow('Request timed out');
  });

  it('preserves non-JSON responses as text', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('Plain text response', {
          status: 200,
        }),
      ),
    );

    const result = await apiRequest(API_URL);

    expect(result.body).toBe('Plain text response');
  });

  it('aborts an HTTP request when the timeout expires', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        (_url: string, options: RequestInit) => {
          return new Promise((_resolve, reject) => {
            const signal = options.signal;

            if (!signal) {
              reject(new Error('Missing abort signal'));
              return;
            }

            signal.addEventListener(
              'abort',
              () => reject(signal.reason),
              { once: true },
            );

            if (signal.aborted) {
              reject(signal.reason);
            }
          });
        },
      ),
    );

    await expect(
      apiRequest(API_URL, 1000),
    ).rejects.toThrow();
  }, 3000);
});
