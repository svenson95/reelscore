import { HttpErrorResponse } from '@angular/common/http';
import type { RetryConfig } from 'rxjs';
import { timer } from 'rxjs';

const MAX_RETRY_COUNT = 3;
const INITIAL_RETRY_DELAY_MS = 500;

const isRetryableError = (error: unknown): boolean => {
  if (!(error instanceof HttpErrorResponse)) return false;

  return (
    error.status === 0 ||
    error.status === 408 ||
    error.status === 429 ||
    error.status >= 500
  );
};

export const retryDelay = (error: unknown, retryCount: number) => {
  if (!isRetryableError(error)) {
    throw error;
  }

  const delayMs = INITIAL_RETRY_DELAY_MS * 2 ** (retryCount - 1);

  return timer(delayMs);
};

export const errorHandler: RetryConfig = {
  count: MAX_RETRY_COUNT, // Without an explicit count, RxJS retries forever and keeps the UI pending
  delay: retryDelay,
};
