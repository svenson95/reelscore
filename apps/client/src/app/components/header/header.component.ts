import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  MatProgressBarModule,
  ProgressBarMode,
} from '@angular/material/progress-bar';

import { LeagueService } from '../../services';
import { LogoComponent } from '../logo/logo.component';

import { LeagueSelectorComponent } from './league-selector/league-selector.component';

@Component({
  selector: 'header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent, LeagueSelectorComponent, MatProgressBarModule],
  template: `
    <futbet-logo (click)="setSelectedLeague()" />
    <futbet-league-selector />
    <div class="absolute inset-x-0 top-0">
      <mat-progress-bar [mode]="progressMode()"></mat-progress-bar>
    </div>
  `,
})
export class HeaderComponent {
  private readonly service = inject(LeagueService);

  readonly isLoading = signal<boolean>(false);

  readonly progressMode = computed<ProgressBarMode>(() =>
    this.isLoading() ? 'indeterminate' : 'determinate'
  );

  setSelectedLeague(): void {
    this.service.selectedLeague.set(undefined);
  }
}
