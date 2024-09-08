import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { getTeamLogo } from '@app/models';
import { FixtureDTO, FixtureHighlights } from '@lib/models';
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
    .header-divider { 
      @apply flex items-center gap-5;

      .divider { @apply w-full h-[1px] bg-[#e5e7eb]; }
      button { @apply flex; }
      mat-icon { @apply shrink-0; }
    }
  `,
  template: `
    <reelscore-match-header-data [data]="data()" />
    @if (highlights() && data().fixture.status.short === 'FT') {
    <div class="header-divider">
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
