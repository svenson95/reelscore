import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  COMPETITION_DATA,
  COMPETITION_ID,
} from '../../../../../../../constants';
import { HttpRapidService } from '../../../../../services';

@Component({
  selector: 'futbet-admin-update-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
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
export class UpdateFixturesComponent {
  protected readonly leagues = COMPETITION_DATA;

  readonly formGroup = new FormGroup({
    leagueId: new FormControl(COMPETITION_ID.GERMANY_BUNDESLIGA, [
      Validators.required,
    ]),
    matchDay: new FormControl(1, [Validators.required]),
  });

  destroyRef = inject(DestroyRef);
  snackBar = inject(MatSnackBar);
  rs = inject(HttpRapidService);

  get matchDays(): number[] {
    const leagueSize = this.leagues.find(
      (l) => l.id === this.formGroup.value.leagueId
    )?.size;
    const size = (leagueSize ?? 0) * 2 - 2;
    return Array.from({ length: size }, (_, idx) => idx + 1);
  }

  onSubmit(): void {
    const { leagueId, matchDay } = this.formGroup.value;
    if (!leagueId || !matchDay) return;
    this.rs
      .fetchFixtures(leagueId, matchDay)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        () => this.openSnackBar('Daten geladen'),
        () => this.openSnackBar('Fehler aufgetreten')
      );
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, undefined, { duration: 3000 });
  }
}
