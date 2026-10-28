
import { describe, expect, it } from 'vitest';
import { checkHealth } from '../src/tools/health/index.js';

describe('health_check', () => {
  it('returns an operational status with a valid timestamp', () => {
    const status = checkHealth();

    expect(status.status).toBe('ok');
    expect(status.timestamp).toEqual(expect.any(String));
    expect(new Date(status.timestamp).toISOString()).toBe(
      status.timestamp,
    );
  });
});
