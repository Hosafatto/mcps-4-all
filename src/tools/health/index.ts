import type { ServerStatus } from '../../server.js';

export function checkHealth(): ServerStatus {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
