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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { COMPETITION_ID, SELECT_LEAGUE } from '../../../../../../../constants';
import { HttpRapidService } from '../../../../../service';

@Component({
  selector: 'futbet-admin-update-standings',
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
          <mat-option [value]="league.id">
            {{ league.label }}
          </mat-option>
          }
        </mat-select>
      </mat-form-field>

      <button mat-raised-button type="submit" [disabled]="formGroup.invalid">
        Laden
      </button>
    </form>
  `,
})
export class UpdateStandingsComponent {
  protected readonly leagues = SELECT_LEAGUE;

  formGroup = new FormGroup({
    leagueId: new FormControl(COMPETITION_ID.GERMANY_BUNDESLIGA, [
      Validators.required,
    ]),
  });

  destroyRef = inject(DestroyRef);
  rs = inject(HttpRapidService);
  snackBar = inject(MatSnackBar);

  onSubmit(): void {
    const { leagueId } = this.formGroup.value;
    if (!leagueId) return;

    this.rs
      .fetchStandings(leagueId)
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
