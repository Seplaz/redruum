export const getErrorMessage = (error: unknown): string => {
  const FALLBACK_MESSAGE = "Что-то пошло не так. Попробуйте ещё раз.";

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "Нет соединения с интернетом.";
    }

    if (message.includes("duplicate")) {
      return "Такое сообщение уже существует.";
    }

    if (message.includes("permission") || message.includes("policy")) {
      return "Недостаточно прав.";
    }

    return FALLBACK_MESSAGE;
  }

  return FALLBACK_MESSAGE;
};
