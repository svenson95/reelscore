import { Injectable, WritableSignal, signal } from '@angular/core';
import { FixtureId } from '@lib/models';

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
