import { Injectable, WritableSignal, signal } from '@angular/core';

import { AdminView } from '../models';

export abstract class AdminService {
  abstract view: WritableSignal<AdminView>;
}

@Injectable()
export class AbstractedAdminService extends AdminService {
  view = signal<AdminView>('overview-fixtures');
}

export const ADMIN_SERVICE_PROVIDER = {
  provide: AdminService,
  useClass: AbstractedAdminService,
};
