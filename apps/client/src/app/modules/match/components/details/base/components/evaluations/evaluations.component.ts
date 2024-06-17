import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EvaluationsService } from '../../../../../services';

@Component({
  selector: 'futbet-match-evaluations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col bg-white border-[1px] rounded-fb; }
    section { 
      @apply flex flex-col gap-5 p-5;

      &:first-of-type { @apply border-b-[1px]; }
      .header { @apply flex flex-col xs:flex-row xs:justify-between; }
      .header > div { @apply flex gap-5 items-center; }
      .today { @apply content-center; }
      .header > div, .today { @apply text-fb-font-size-body-2 text-fb-color-text-2; }
    }

    .evaluation {
      @apply flex gap-5 text-fb-font-size-small xs:text-fb-font-size-body-2;

      > div:not(.today) { 
        @apply flex flex-1 gap-1 xs:gap-2; 

        &:first-of-type { @apply justify-end; }
      }

      span {
        @apply w-[19px] h-[19px] xs:w-[24px] xs:h-[24px] flex items-center justify-center leading-[19px] xs:leading-[24px];

        &.loss, &.low { @apply bg-fb-lose; }
        &.draw, &.middle { @apply bg-gray-200; }
        &.win, &.high { @apply bg-fb-win; }
      }
    }
  `,
  template: `
    <h3 class="match-section-title">ANALYSE</h3>
    @if (evaluations()?.teams; as teams) {
    <div class="content">
      <section>
        <div class="header">
          <h4>Ergebnisse</h4>
          <div>
            <span>N = Niederlage</span>
            <span>U = Unentschieden</span>
            <span>S = Sieg</span>
          </div>
        </div>
        <div class="evaluation">
          <div id="home">
            @for (result of teams.home.results.reverse(); track result) {
            <span [class]="result.toLowerCase()">
              @switch(result) { @case ("LOSS") {N} @case ("DRAW") {U} @case
              ("WIN") {S} }
            </span>
            }
          </div>

          <div class="today">Heute</div>

          <div id="away">
            @for (result of teams.away.results; track result) {
            <span [class]="result.toLowerCase()">
              @switch(result) { @case ("LOSS") {N} @case ("DRAW") {U} @case
              ("WIN") {S} }
            </span>
            }
          </div>
        </div>
      </section>

      <section>
        <div class="header">
          <h4>Performance</h4>
          <div>
            <span>S = Schlecht</span>
            <span>M = Mittelmäßig</span>
            <span>G = Gut</span>
          </div>
        </div>
        <div class="evaluation">
          <div id="home">
            @for (performance of teams.home.performances.reverse(); track
            performance) {
            <span [class]="performance.toLowerCase()">
              @switch(performance) { @case ("LOW") {S} @case ("MIDDLE") {M}
              @case ("HIGH") {G} }
            </span>
            }
          </div>

          <div class="today">Heute</div>

          <div id="away">
            @for (performance of teams.away.performances; track performance) {
            <span [class]="performance.toLowerCase()">
              @switch(performance) { @case ("LOW") {S} @case ("MIDDLE") {M}
              @case ("HIGH") {G} }
            </span>
            }
          </div>
        </div>
      </section>
    </div>
    }
  `,
})
export class MatchEvaluationsComponent {
  es = inject(EvaluationsService);

  evaluations = this.es.evaluations;
}
