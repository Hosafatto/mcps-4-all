export interface HealthStatus {
  status: 'ok';
  timestamp: string;
}

export function checkHealth(): HealthStatus {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
