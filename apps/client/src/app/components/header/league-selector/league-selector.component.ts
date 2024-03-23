import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { LEAGUES_METADATA } from '../../../constants';
import { LeagueSelectData } from '../../../models';
import { LeagueService } from '../../../services';

@Component({
  selector: 'futbet-league-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatButtonToggleModule],
  template: `
    <mat-button-toggle-group [value]="selectedLeague()?.label">
      @for (l of leagues; track l.label) {
        <mat-button-toggle
          [id]="l.id"
          [value]="l.label"
          (click)="setSelectedLeague(l)"
        >
          <span class="league-label">{{ l.label }}</span>
        </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
})
export class LeagueSelectorComponent {
  private readonly service = inject(LeagueService);

  readonly leagues: LeagueSelectData[] = LEAGUES_METADATA;
  readonly selectedLeague = this.service.selectedLeague;

  setSelectedLeague(league: LeagueSelectData): void {
    this.service.selectedLeague.set(league);
  }
}
