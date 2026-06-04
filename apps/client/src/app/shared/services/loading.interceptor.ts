import type {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest} from '@angular/common/http';
import {
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { finalize } from 'rxjs';

import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  loadingService = inject(LoadingService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.isLoading.set(true);

    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.isLoading.set(false);
      })
    );
  }
}

export const HTTP_INTERCEPTOR_PROVIDER = {
  provide: HTTP_INTERCEPTORS,
  useClass: LoadingInterceptor,
  multi: true,
};
