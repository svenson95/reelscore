import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class RouteService {
  private readonly route = inject(ActivatedRoute);

  readonly url = toSignal(this.route.url);

  readonly activeRoute = computed<string>(() => {
    const url = this.url();
    return url !== undefined ? url[1]?.path : '/';
  });
}
