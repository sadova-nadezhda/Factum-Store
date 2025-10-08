export const okIfNoError = (response: Response, result: unknown) =>
  response.ok && !(result as any)?.error;
