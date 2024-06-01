import { AsyncPipe, NgIf } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FixtureId } from '@lib/models';

import { FixturesService } from '../../services';

import { BackButtonComponent } from '../../components';
import {
  MatchAfterDetailsComponent,
  MatchBeforeDetailsComponent,
  MatchResultComponent,
} from './components';

@Component({
  selector: 'futbet-match',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatProgressSpinnerModule,
    BackButtonComponent,
    MatchResultComponent,
    MatchBeforeDetailsComponent,
    MatchAfterDetailsComponent,
  ],
  styles: `
    :host { @apply w-full; } 
    
    futbet-match-result, 
    futbet-match-before-details, 
    futbet-match-after-details { @apply pb-5; }

    futbet-match-before-details, 
    futbet-match-after-details { @apply gap-5 flex flex-col; }
  `,
  template: `
    <section class="header">
      <futbet-back-button />
    </section>

    <ng-container *ngIf="{ data: fixture() | async } as myData">
      @switch (!!myData.data) { @case(false) {
      <mat-spinner *ngIf="!myData.data" class="my-2 mx-auto" diameter="20" />
      } @case (true) {
      <futbet-match-result [data]="myData.data!" [isUpcoming]="isUpcoming()" />
      } }
    </ng-container>

    <!-- @switch(isUpcoming()) { @case(true) {
    <futbet-match-before-details />
    } @case(false) {
    <futbet-match-after-details />
    }} -->
  `,
})
export class MatchComponent {
  fixtureId = input.required<FixtureId>();

  fs = inject(FixturesService);

  fixture = computed(() => this.fs.requestFixtureDetails(this.fixtureId()));

  isUpcoming = signal<boolean>(true);
}
