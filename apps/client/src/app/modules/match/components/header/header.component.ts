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
      @apply flex flex-col mx-auto p-5 rounded-fb w-full max-w-rs-max-width bg-white;
      border: 1px solid var(--mat-standard-button-toggle-divider-color);
    }
    .toggle-highlights-row { 
      &.is-hidden .divider { animation: opacityDown 200ms ease forwards; }
      .divider { 
        @apply w-full h-[1px] bg-[#e5e7eb]; 
        animation: opacityUp 200ms ease forwards;
      }

      @keyframes opacityUp {
        0% { opacity: 0; margin-block: 0; }
        100% { opacity: 1; margin-block: .5rem; }
      }
      @keyframes opacityDown {
        0% { opacity: 1; margin-block: .5rem; }
        100% { opacity: 0; margin-block: 0; }
      }
    }

    .animation-wrapper {
      display: grid;
      grid-template-rows: 1fr;
      transition: grid-template-rows 200ms ease-out;
      &.is-hidden { grid-template-rows: 0fr; }
      .match-highlights { overflow: hidden; }
    }
  `,
  template: `
    <reelscore-match-header-data [data]="data()" />
    @if (highlights() && isNotGoalLess()) {
    <div class="toggle-highlights-row" [class.is-hidden]="isScrolled()">
      <div class="divider"></div>
    </div>
    <div class="animation-wrapper" [class.is-hidden]="isScrolled()">
      <reelscore-match-header-details
        class="match-highlights"
        [data]="data()"
        [highlights]="highlights()!"
      />
    </div>
    }
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
          const maxScrollHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          );
          const minScrollHeight = 1200;
          this.isScrolled.set(isScrolled && maxScrollHeight > minScrollHeight);
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
