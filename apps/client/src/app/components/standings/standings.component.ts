import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StandingsDTO } from '@lib/models';

import { StandingsService } from '../../services';

import { TableComponent } from './components';

@Component({
  selector: 'futbet-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, TableComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @if (isLoading()) {
    <mat-spinner class="my-10 mx-auto" diameter="20" />
    } @else if(showAllTables()) {@for (singleTable of multiple; track
    singleTable.league.id) {
    <futbet-standings-table [data]="singleTable" />
    } } @else {
    <futbet-standings-table [data]="single" />
    }
  `,
})
export class StandingsComponent {
  service = inject(StandingsService);
  standings = this.service.standings;
  isLoading = this.service.isLoading;

  showAllTables = computed(() => this.standings() instanceof Array);

  get single(): StandingsDTO {
    return this.standings() as StandingsDTO;
  }

  get multiple(): StandingsDTO[] {
    return this.standings() as StandingsDTO[];
  }
}
