import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FixtureListComponent } from '@app/components';
import { CompetitionRoundPipe } from '@app/pipes';
import { CompetitionId, FixtureDTO } from '@lib/models';

@Component({
  selector: 'reelscore-competition-fixtures-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, FixtureListComponent, CompetitionRoundPipe],
  styles: `
    :host { @apply flex flex-col gap-5; }
    section:first-of-type { @apply flex justify-between; }
    p { @apply text-fb-font-size-body-2; }
  `,
  template: `
    <section>
      <p>@if (round()) { {{ round()! | competitionRound }} }</p>
      <p>{{ date() | date : 'dd.MM.yy' }}</p>
    </section>
    <section>
      <reelscore-fixture-list [fixtures]="fixtures()" />
    </section>
  `,
})
export class FixturesListComponent {
  competition = input.required<CompetitionId>();
  fixtures = input.required<FixtureDTO[]>();
  isLoading = input.required<boolean>();

  date = computed(() => this.fixtures()[0].fixture.date);
  round = computed(() => this.fixtures()[0].league.round);
}
