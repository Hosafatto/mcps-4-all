import { describe, expect, it } from 'vitest';
import { createServer } from '../src/server.js';

describe('createServer', () => {
  it('returns an operational status with a timestamp', () => {
    const server = createServer();
    const status = server.getStatus();

    expect(status.status).toBe('ok');
    expect(status.timestamp).toEqual(expect.any(String));
    expect(new Date(status.timestamp).toISOString()).toBe(status.timestamp);
  });
});
