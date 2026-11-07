import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { checkHealth } from './tools/health/index.js';
import { apiRequest } from './tools/api/index.js';
import { apiRequestSchema } from './schemas/api-request.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'mcps-4-all',
    version: '0.1.0',
  });

  // Register health check tool
  server.registerTool(
    'health_check',
    {
      description: 'Check whether the MCP server is operational.',
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(checkHealth()),
        },
      ],
    }),
  );

  // Register API request tool
  server.registerTool(
    'api_request',
    {
      description: 'Perform a GET request against the allowed public test API.',
      inputSchema: apiRequestSchema,
    },
    async ({ url, timeoutMs }) => {
      try {
        const result = await apiRequest(url, timeoutMs);

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown HTTP request error';

        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: message,
            },
          ],
        };
      }
    },
  );

  return server;
}
