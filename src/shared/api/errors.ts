import axios from 'axios';

type ApiErrorPayload = {
  detail?: unknown;
  errors?: unknown;
};

const formatFieldErrors = (errors: unknown): string | null => {
  if (!Array.isArray(errors) || errors.length === 0) {
    return null;
  }

  const messages = errors
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }
      if (item && typeof item === 'object') {
        const { key, message } = item as { key?: unknown; message?: unknown };
        if (typeof message === 'string') {
          return typeof key === 'string' && key ? `${key}: ${message}` : message;
        }
      }
      return null;
    })
    .filter((message): message is string => Boolean(message));

  return messages.length ? messages.join('; ') : null;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload | undefined;

    const fieldErrors = formatFieldErrors(data?.errors);
    if (fieldErrors) {
      return fieldErrors;
    }

    if (typeof data?.detail === 'string' && data.detail.trim()) {
      return data.detail;
    }

    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};
