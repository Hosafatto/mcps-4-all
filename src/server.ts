import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { checkHealth } from './tools/health/index.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'mcps-4-all',
    version: '0.1.0',
  });

  server.tool(
    'health_check',
    'Check whether the MCP server is operational.',
    {},
    async () => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(checkHealth()),
        },
      ],
    }),
  );

  return server;
}
