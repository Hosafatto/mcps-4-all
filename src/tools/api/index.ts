export interface ApiToolResult {
  message: string;
}

export function apiTool(message: string): ApiToolResult {
  return { message };
}
