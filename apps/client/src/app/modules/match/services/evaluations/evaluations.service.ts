import { Injectable, Signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { EvaluationDTO } from '@lib/models';
import { FixtureService } from '..';
import { HttpEvaluationsService } from './http.service';

export abstract class EvaluationsService {
  abstract evaluations: Signal<EvaluationDTO | undefined>;
}

@Injectable()
export class AbstractedEvaluationsService extends EvaluationsService {
  http = inject(HttpEvaluationsService);
  fs = inject(FixtureService);

  evaluations = toSignal<EvaluationDTO | undefined>(
    toObservable(this.fs.fixtureId).pipe(
      switchMap((id) => (id ? this.http.getEvaluations(id) : of(undefined)))
    )
  );
}

export const EVALUATIONS_SERVICE_PROVIDER = {
  provide: EvaluationsService,
  useClass: AbstractedEvaluationsService,
};
