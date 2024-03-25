import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { LEAGUES_METADATA } from '../../constants';
import { LeagueService } from '../../services';

@Component({
  selector: 'futbet-league-select-mobile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatFormFieldModule, MatSelectModule],
  styles: `
    mat-form-field {
      @apply w-[200px];
    }
  `,
  template: `
    <mat-form-field>
      <mat-label>Liga</mat-label>
      <mat-select
        hideSingleSelectionIndicator
        [value]="selectedLeague()?.url ?? null"
      >
        @for (l of leagues; track l.id) {
        <mat-option [value]="l.url" [routerLink]="['leagues', l.url]">{{
          l.label
        }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class LeagueSelectMobileComponent {
  private readonly leagueService = inject(LeagueService);

  readonly leagues = LEAGUES_METADATA;
  readonly selectedLeague = this.leagueService.selectedLeague;
}
