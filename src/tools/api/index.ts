import { getHttp } from '../../services/http/index.js';

const ALLOWED_HOST = 'jsonplaceholder.typicode.com';

export async function apiRequest(
  url: string,
  timeoutMs = 5000,
) {
  const parsedUrl = new URL(url);

  if (
    parsedUrl.protocol !== 'https:' ||
    parsedUrl.hostname !== ALLOWED_HOST ||
    parsedUrl.port !== ''
  ) {
    throw new Error(
      'Only HTTPS requests to jsonplaceholder.typicode.com are allowed',
    );
  }

  return getHttp(parsedUrl.toString(), timeoutMs);
}
