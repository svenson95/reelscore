import { Injectable, signal, WritableSignal } from '@angular/core';

export abstract class LoadingService {
  abstract isLoading: WritableSignal<boolean>;
}

@Injectable()
export class AbstractedLoadingService extends LoadingService {
  isLoading = signal<boolean>(false);
}

export const LOADING_SERVICE_PROVIDER = {
  provide: LoadingService,
  useClass: AbstractedLoadingService,
};
