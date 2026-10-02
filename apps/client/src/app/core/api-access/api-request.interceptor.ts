import type { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@app/environment';

const API_REQUEST_TIMEOUT_MS = 10_000;

export const apiRequestInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(environment.api)) {
    return next(request);
  }

  // Bound each attempt so an unanswered request can reach the store's error state.
  const requestWithTimeout = request.clone({
    timeout: request.timeout ?? API_REQUEST_TIMEOUT_MS,
  });

  return next(requestWithTimeout);
};
