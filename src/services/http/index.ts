export interface HttpResponse {
  status: number;
  ok: boolean;
  url: string;
  body: unknown;
}

export async function getHttp(
  url: string,
  timeoutMs = 5000,
): Promise<HttpResponse> {
  const response = await fetch(url, {
    method: 'GET',
    signal: AbortSignal.timeout(timeoutMs),
    redirect: 'error',
  });

  const text = await response.text();

  let body: unknown = text;

  try {
    body = JSON.parse(text);
  } catch {
    // Keep non-JSON responses as plain text.
  }

  return {
    status: response.status,
    ok: response.ok,
    url: response.url,
    body,
  };
}
