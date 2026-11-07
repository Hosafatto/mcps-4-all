
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { z } from 'zod';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

import { createServer } from '../src/server.js';

const API_URL =
  'https://jsonplaceholder.typicode.com/todos/1';

// Validate the expected health_check response.
const healthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string().datetime(),
});

// Validate the expected api_request response.
const apiResponseSchema = z.object({
  status: z.number(),
  ok: z.boolean(),
  url: z.string().url(),
  body: z.object({
    id: z.number(),
  }).passthrough(),
});

// Safely extract text from an MCP tool result.
function getTextContent(result: unknown): string {
  if (typeof result !== 'object' || result === null) {
    throw new Error('Expected an MCP result object');
  }

  if (
    !('content' in result) ||
    !Array.isArray(result.content)
  ) {
    throw new Error('Expected MCP content array');
  }

  const firstContent: unknown = result.content[0];

  if (
    typeof firstContent !== 'object' ||
    firstContent === null ||
    !('type' in firstContent) ||
    firstContent.type !== 'text' ||
    !('text' in firstContent) ||
    typeof firstContent.text !== 'string'
  ) {
    throw new Error('Expected MCP text content');
  }

  return firstContent.text;
}

// Restore mocked functions after every test.
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// Create an MCP client connected to our server in memory.
async function createConnectedClient() {
  const server = createServer();

  const client = new Client({
    name: 'mcps-4-all-test-client',
    version: '0.1.0',
  });

  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();

  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);

  return { client, server };
}

describe('MCP protocol integration', () => {
  it('discovers registered MCP tools', async () => {
    const { client, server } = await createConnectedClient();

    try {
      const response = await client.listTools();

      const toolNames = response.tools.map(
        (tool) => tool.name,
      );

      expect(toolNames).toContain('health_check');
      expect(toolNames).toContain('api_request');
    } finally {
      await client.close();
      await server.close();
    }
  });

  it('executes health_check through MCP', async () => {
    const { client, server } = await createConnectedClient();

    try {
      const result = await client.callTool({
        name: 'health_check',
        arguments: {},
      });

      expect(result.isError).not.toBe(true);

      const body = healthResponseSchema.parse(
        JSON.parse(getTextContent(result)),
      );

      expect(body.status).toBe('ok');
      expect(body.timestamp).toEqual(
        expect.any(String),
      );
    } finally {
      await client.close();
      await server.close();
    }
  });

  it('executes api_request through MCP', async () => {
    const mockFetch = vi.fn().mockImplementation(
        async (url: string) => {
            const response = new Response(
                JSON.stringify({
                    id: 1,
                    title: 'Integration test',
                }),
                { status: 200 },
            );

            Object.defineProperty(response, 'url', {
                value: url,
            });

            return response;
        },
    );

    vi.stubGlobal('fetch', mockFetch);

    const { client, server } = await createConnectedClient();

    try {
      const result = await client.callTool({
        name: 'api_request',
        arguments: {
          url: API_URL,
          timeoutMs: 5000,
        },
      });

      expect(result.isError).not.toBe(true);

      const body = apiResponseSchema.parse(
        JSON.parse(getTextContent(result)),
      );

      expect(body.status).toBe(200);
      expect(body.ok).toBe(true);
      expect(body.url).toBe(API_URL);
      expect(body.body.id).toBe(1);

      expect(mockFetch).toHaveBeenCalledOnce();
    } finally {
      await client.close();
      await server.close();
    }
  });

  it('rejects invalid tool arguments through Zod', async () => {
    const mockFetch = vi.fn();

    vi.stubGlobal('fetch', mockFetch);

    const { client, server } = await createConnectedClient();

    try {
      const result = await client.callTool({
        name: 'api_request',
        arguments: {
          url: 'not-a-valid-url',
          timeoutMs: 5000,
        },
      });

      expect(result.isError).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    } finally {
      await client.close();
      await server.close();
    }
  });

  it('returns MCP tool errors for unauthorized domains', async () => {
    const mockFetch = vi.fn();

    vi.stubGlobal('fetch', mockFetch);

    const { client, server } = await createConnectedClient();

    try {
      const result = await client.callTool({
        name: 'api_request',
        arguments: {
          url: 'https://example.com',
          timeoutMs: 5000,
        },
      });

      expect(result.isError).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    } finally {
      await client.close();
      await server.close();
    }
  });
});
