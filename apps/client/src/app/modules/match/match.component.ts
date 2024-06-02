import { AsyncPipe, NgIf } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FixtureId } from '@lib/models';

import { FixturesService } from '../../services';

import { MatchContentComponent } from './components/content/content.component';

@Component({
  selector: 'futbet-match',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatProgressSpinnerModule, MatchContentComponent],
  styles: `
    :host { @apply w-full; } 
    
    futbet-match-result, 
    futbet-match-before-details, 
    futbet-match-after-details { @apply pb-5; }

    futbet-match-before-details, 
    futbet-match-after-details { @apply gap-5 flex flex-col; }
  `,
  template: `
    <ng-container *ngIf="{ data: fixture() | async } as myData">
      @switch (!!myData.data) { @case(false) {
      <mat-spinner class="my-2 mx-auto" diameter="20" />
      } @case (true) {
      <futbet-match-content [data]="myData.data!" />
      } }
    </ng-container>
  `,
})
export class MatchComponent {
  fixtureId = input.required<FixtureId>();
  fs = inject(FixturesService);

  fixture = computed(() => this.fs.requestFixtureDetails(this.fixtureId()));
}
