export interface ServerStatus {
  status: 'ok';
  timestamp: string;
}

export function createServer() {
  return {
    listen(port: number, onReady: () => void): void {
      onReady();
    },
    getStatus(): ServerStatus {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    },
  };
}
