import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { COMPETITION_DATA, COMPETITION_ID } from '@app/constants';
import { HttpFixturesService } from '@app/services';
import { HttpRapidService } from '../../../../../services';

@Component({
  selector: 'futbet-admin-update-fixture-statistics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  styles: `
        form { @apply flex gap-5 items-center; }
      `,
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Liga</mat-label>
        <mat-select formControlName="leagueId">
          @for(league of leagues; track league.id) {
          <mat-option [value]="league.id">{{ league.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Spieltag</mat-label>
        <mat-select formControlName="matchDay">
          @for(day of matchDays; track day) {
          <mat-option [value]="day">{{ day }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <button mat-raised-button type="submit" [disabled]="formGroup.invalid">
        Laden
      </button>
    </form>
  `,
})
export class UpdateFixtureStatisticsComponent {
  readonly leagues = COMPETITION_DATA;
  snackBar = inject(MatSnackBar);
  rapidService = inject(HttpRapidService);
  ds = inject(HttpFixturesService);

  formGroup = new FormGroup({
    leagueId: new FormControl(COMPETITION_ID.GERMANY_BUNDESLIGA, [
      Validators.required,
    ]),
    matchDay: new FormControl(1, [Validators.required]),
  });

  get matchDays(): number[] {
    return Array.from({ length: 30 }, (_, idx) => idx + 1);
  }

  onSubmit(): void {
    const { leagueId, matchDay } = this.formGroup.value;
    if (!leagueId || !matchDay) return;

    this.ds.getMatchDayFixtures(leagueId, matchDay).subscribe((matches) => {
      matches.forEach(async (match) =>
        this.rapidService.fetchStatistics(match.fixture.id).subscribe()
      );
      this.snackBar.open('Daten geladen', undefined, { duration: 3000 });
    });
  }
}
