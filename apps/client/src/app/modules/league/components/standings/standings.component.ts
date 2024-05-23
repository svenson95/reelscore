import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StandingsDTO } from '../../../../models';
import { StandingsService } from '../../../../services';

import { TableComponent } from './components';

@Component({
  selector: 'futbet-league-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, TableComponent],
  styles: ``,
  template: `
    @if (isLoaded()) {
    <futbet-league-standings-table [data]="data" />
    } @else if (standings() === 'loading') {
    <mat-spinner class="my-10 mx-auto" diameter="20" /> }
  `,
})
export class StandingsComponent {
  service = inject(StandingsService);
  standings = this.service.standings;

  isLoaded = computed(
    () => !!this.standings() && this.standings() !== 'loading'
  );

  get data() {
    return this.standings() as StandingsDTO;
  }
}
