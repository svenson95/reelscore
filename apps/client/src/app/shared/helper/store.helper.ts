import { HttpErrorResponse } from '@angular/common/http';
import { timer } from 'rxjs';

const isRetryableError = (error: unknown): boolean => {
  if (!(error instanceof HttpErrorResponse)) return false;

  return (
    error.status === 0 ||
    error.status === 408 ||
    error.status === 429 ||
    error.status >= 500
  );
};

export const retryDelay = (error: unknown) => {
  if (!isRetryableError(error)) {
    throw error;
  }

  const RETRY_COUNT = 3;
  // 500ms, 1000ms, 2000ms
  return timer(500 * 2 ** (RETRY_COUNT - 1));
};

export const errorHandler = {
  delay: retryDelay,
};
