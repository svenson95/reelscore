import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { getTeamLogo } from '@app/shared';
import {
  FinishedMatchStatusValues,
  FixtureDTO,
  FixtureHighlights,
} from '@lib/models';
import { HeaderDataComponent, HeaderDetailsComponent } from './components';

@Component({
  selector: 'reelscore-match-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    HeaderDataComponent,
    HeaderDetailsComponent,
  ],
  styles: `
    :host { 
      @apply flex flex-col mx-auto p-5 gap-2 rounded-fb w-full max-w-fb-max-width bg-white border-[1px];
    }
    .toggle-highlights-row { 
      @apply flex items-center gap-5;

      .divider { @apply w-full h-[1px] bg-[#e5e7eb]; }
      button { @apply flex; }
      mat-icon { @apply shrink-0; }

      animation: slideUp 0.3s ease forwards;
      .divider { animation: opacityUp 0.3s ease forwards;}
      &.is-hidden {
        animation: slideDown 0.3s ease forwards;
        .divider { animation: opacityDown 0.3s ease forwards; }
      }

      @keyframes opacityUp {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes opacityDown {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }

      $slideValue: calc(-24px + -0.5rem);
      @keyframes slideUp {
        0% { margin-top: $slideValue; }
        100% { margin-top: 0; }
      }
      @keyframes slideDown {
        0% { margin-top: 0; }
        100% { margin-top: $slideValue; }
      }
    }
  `,
  template: `
    <reelscore-match-header-data [data]="data()" />
    @if (highlights() && isFinished() && isNotGoalLess()) {
    <div
      class="toggle-highlights-row"
      [class.is-hidden]="showHighlights() === false"
    >
      <div class="divider"></div>
      <button
        (click)="toggleHighlights()"
        [disabled]="highlights()!.length === 0"
      >
        <mat-icon>{{
          showHighlights() ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
        }}</mat-icon>
      </button>
      <div class="divider"></div>
    </div>
    @if (showHighlights()) {
    <reelscore-match-header-details
      [data]="data()"
      [highlights]="highlights()!"
    />
    } }
  `,
})
export class MatchHeaderComponent implements OnInit {
  data = input.required<FixtureDTO>();
  highlights = input.required<FixtureHighlights | undefined>();
  showHighlights = signal(false);

  isFinished = computed(() => {
    const status = this.data().fixture.status.short;
    return FinishedMatchStatusValues.some((s) => s === status);
  });

  isNotGoalLess = computed(() => {
    return (
      (this.data().goals.home !== 0 || this.data().goals.away !== 0) &&
      this.data().fixture.status.short !== 'PEN'
    );
  });

  ngOnInit(): void {
    const highlights = this.highlights();
    if (highlights && highlights.length) {
      this.showHighlights.set(true);
    }
  }

  getTeamLogo = getTeamLogo;

  toggleHighlights() {
    const currentValue = this.showHighlights();
    this.showHighlights.set(!currentValue);
  }
}
