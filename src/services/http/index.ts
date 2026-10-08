export interface HttpClientOptions {
  baseUrl: string;
  timeoutMs?: number;
}

export function createHttpClient(options: HttpClientOptions): HttpClientOptions {
  return options;
}
