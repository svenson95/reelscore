import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';

import { LEAGUES_METADATA } from '../../constants';
import { LeagueService } from '../../services';

import { LogoComponent } from '../logo/logo.component';

export const SELECTED_LEAGUE_DEFAULT = 'start';

@Component({
  selector: 'header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    LogoComponent,
    MatButtonToggleModule,
  ],
  template: `
    <mat-button-toggle-group
      class="w-full"
      hideSingleSelectionIndicator
      name="fontStyle"
      [formControl]="leagueControl"
    >
      <mat-button-toggle
        [value]="'start'"
        class="logo-toggle mr-auto"
        [routerLink]="['']"
      >
        <futbet-logo />
      </mat-button-toggle>
      @for (l of leagues; track l.label) {
      <mat-button-toggle
        [value]="l.url"
        [routerLink]="['leagues', l.url]"
        [class]="l.url"
      >
        <span class="league-label">{{ l.flag }} {{ l.label }}</span>
      </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
})
export class HeaderComponent {
  private readonly service = inject(LeagueService);
  readonly leagues = LEAGUES_METADATA;
  readonly selectedLeague = this.service.selectedLeague;

  readonly leagueControl = new FormControl<string>(
    this.selectedLeague()?.url ?? SELECTED_LEAGUE_DEFAULT
  );

  updateFormOnChange = effect(() => {
    this.leagueControl.setValue(
      this.selectedLeague()?.url ?? SELECTED_LEAGUE_DEFAULT
    );
  });
}
