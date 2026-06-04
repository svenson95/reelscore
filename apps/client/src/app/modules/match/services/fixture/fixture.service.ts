import type { WritableSignal} from '@angular/core';
import { Injectable, signal } from '@angular/core';
import type { FixtureId } from '@lib/models';

export abstract class FixtureService {
  abstract fixtureId: WritableSignal<FixtureId | undefined>;
}

@Injectable()
export class AbstractedFixtureService extends FixtureService {
  fixtureId = signal<FixtureId | undefined>(undefined);
}

export const FIXTURE_SERVICE_PROVIDER = {
  provide: FixtureService,
  useClass: AbstractedFixtureService,
};
