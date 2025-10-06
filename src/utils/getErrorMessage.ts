export function getErrorMessage(error: unknown): string {
  if (!error) return '';
  const e = error as any;

  if (e?.status === 'FETCH_ERROR') return 'Не удалось подключиться к серверу';
  if (e?.status === 'TIMEOUT_ERROR') return 'Превышено время ожидания ответа';
  if (e?.status === 'PARSING_ERROR') return 'Некорректный ответ сервера';

  if ('data' in e) {
    const data = e.data;
    if (typeof data === 'string') return data;
    if (typeof data?.error === 'string') return data.error;
    if (typeof data?.message === 'string') return data.message;
  }

  if ('error' in e && typeof e.error === 'string') return e.error;

  return 'Произошла ошибка';
}
