import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap } from 'rxjs';

import { FixtureId } from '@lib/models';

import { FixturesService, ROUTE_SERVICE_PROVIDER } from '../../services';
import { RouterView } from '../router-view';

import { MatchContentComponent } from './components/content/content.component';

@Component({
  selector: 'futbet-match',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatProgressSpinnerModule, MatchContentComponent],
  providers: [ROUTE_SERVICE_PROVIDER],
  styles: `
    :host { @apply w-full; } 
    
    futbet-match-result, 
    futbet-match-before-details, 
    futbet-match-after-details { @apply pb-5; }

    futbet-match-before-details, 
    futbet-match-after-details { @apply gap-5 flex flex-col; }
  `,
  template: `
    @if (fixture() === undefined || latestFixtures() === undefined){
    <mat-spinner class="my-2 mx-auto" diameter="20" />
    } @else {
    <futbet-match-content
      [data]="fixture()!"
      [latestFixtures]="latestFixtures()!"
    />
    }
  `,
})
export class MatchComponent extends RouterView {
  fixtureId = input.required<FixtureId>();
  fs = inject(FixturesService);

  fixture = toSignal(
    toObservable(this.fixtureId).pipe(
      switchMap((id) => this.fs.loadFixture(id))
    )
  );

  latestFixtures = toSignal(
    toObservable(this.fixtureId).pipe(
      switchMap((fixtureId) => this.fs.loadLatestFixtures(fixtureId))
    )
  );
}
