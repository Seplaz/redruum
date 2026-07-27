export const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    const message = error.message.toLowerCase();

    if (message.includes('network')) {
      return 'Нет соединения с интернетом.';
    }

    if (message.includes('duplicate')) {
      return 'Такое сообщение уже существует.';
    }

    if (message.includes('permission')) {
      return 'Недостаточно прав.';
    }

    return error.message;
  }

  return 'Произошла неизвестная ошибка.';
};
