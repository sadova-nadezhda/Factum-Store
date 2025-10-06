export function getErrorMessage(error: unknown): string {
  if (!error) return '';
  if ('data' in (error as any)) {
    const data = (error as any).data;
    if (typeof data === 'string') return data;
    if (typeof data?.error === 'string') return data.error;
    if (typeof data?.message === 'string') return data.message;
  }
  if ('error' in (error as any)) return (error as any).error;
  return 'Произошла ошибка';
}
