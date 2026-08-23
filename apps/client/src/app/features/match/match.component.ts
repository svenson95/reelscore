import {
  type OnDestroy,
  type OnInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';

import { type CompetitionUrl, type FixtureId } from '@lib/models';

import {
  MatchDetailsComponent,
  MatchHeaderComponent,
  PageHeaderComponent,
} from './components';
import { MatchFacade } from './match.facade';
import { MatchRefreshService, SERVICE_PROVIDERS } from './services';
import { STORE_PROVIDERS } from './store';

@Component({
  selector: 'rs-match-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, MatchHeaderComponent, MatchDetailsComponent],
  providers: [MatchFacade, ...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { @apply gap-5; }
    :host ::ng-deep h2 { text-align: center; }
  `,
  template: `
    @if (error()) {
    <section class="page-error">
      <p class="no-data">Es ist ein Fehler aufgetreten.</p>
    </section>
    } @else {
    <nav
      aria-label="Page-Header Navigation"
      rs-page-header
      class="animate-drop-from-top"
    ></nav>

    <section
      rs-match-header
      [data]="data()"
      [highlights]="fixture()?.highlights ?? null"
    ></section>

    <section rs-match-details></section>
    }
  `,
})
export class MatchComponent implements OnInit, OnDestroy {
  readonly fixtureId = input.required<FixtureId>();
  readonly competitionUrl = input.required<CompetitionUrl>();

  private readonly facade = inject(MatchFacade);
  private readonly refreshService = inject(MatchRefreshService);

  readonly fixture = this.facade.fixture;
  readonly data = this.facade.data;
  readonly error = this.facade.error;

  private readonly loadFixtureEffect = effect(() => {
    this.facade.loadFixture(this.fixtureId());
  });

  private readonly invalidUrlEffect = effect(() => {
    this.facade.handleInvalidUrl(this.competitionUrl());
  });

  ngOnInit(): void {
    this.refreshService.init(this.fixtureId());
  }

  ngOnDestroy(): void {
    this.refreshService.destroy();
  }
}
