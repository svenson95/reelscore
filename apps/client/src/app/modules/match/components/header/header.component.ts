import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  NgZone,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounce, fromEvent, timer } from 'rxjs';

import { FixtureDTO, FixtureHighlights } from '@lib/models';

import { HeaderDataComponent, HeaderDetailsComponent } from './components';

@Component({
  selector: 'reelscore-match-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderDataComponent, HeaderDetailsComponent],
  styles: `
    :host { 
      @apply flex flex-col mx-auto p-5 rounded-fb w-full max-w-fb-max-width bg-white;
      border: 1px solid var(--mat-standard-button-toggle-divider-color);
    }
    .toggle-highlights-row { 
      animation: slideUp 0.3s ease forwards;

      &.is-hidden {
        animation: slideDown 0.3s ease forwards;
      }

      &.is-hidden .divider { animation: opacityDown 0.3s ease forwards; }
      .divider { 
        @apply w-full h-[1px] bg-[#e5e7eb]; 
        animation: opacityUp 0.3s ease forwards;
      }

      button { @apply flex; }
      mat-icon { @apply shrink-0; }
      
      @keyframes opacityUp {
        0% { opacity: 0; margin-block: 0; }
        100% { opacity: 1; margin-block: .75rem; }
      }
      @keyframes opacityDown {
        0% { opacity: 1; margin-block: .75rem; }
        100% { opacity: 0; margin-block: 0; }
      }

      $slideValue: -0.5rem;
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
    @if (highlights() && isNotGoalLess()) {
    <div class="toggle-highlights-row" [class.is-hidden]="isScrolled()">
      <div class="divider"></div>
    </div>
    @if (!isScrolled()) {
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

  ngZone = inject(NgZone);
  isScrolled = signal<boolean>(false);
  scrollEvent$ = fromEvent(window, 'scroll').pipe(
    takeUntilDestroyed(),
    debounce(() => timer(this.isScrolled() ? 20 : 0))
  );

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.scrollEvent$.subscribe(() => {
        this.ngZone.run(() => {
          const isScrolled = window.scrollY > 40;
          this.isScrolled.set(isScrolled);
        });
      });
    });
  }

  isNotGoalLess = computed<boolean>(() => {
    const { goals, fixture } = this.data();
    return (
      goals.home !== null &&
      goals.away !== null &&
      (goals.home > 0 || goals.away > 0) &&
      fixture.status.short !== 'PEN'
    );
  });
}
