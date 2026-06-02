import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import moment from 'moment';

import { PageRefreshService } from '@app/shared';
import type { CompetitionUrl, FixtureId } from '@lib/models';

import { RouterView } from '../router-view';

import {
  MatchDetailsComponent,
  MatchHeaderComponent,
  PageHeaderComponent,
} from './components';
import { MatchFacade } from './match.facade';
import { SERVICE_PROVIDERS, VisibilityObserverService } from './services';
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
      [highlights]="fixture()?.highlights"
    ></section>

    <section rs-match-details></section>
    }
  `,
})
export class MatchComponent extends RouterView implements OnInit, OnDestroy {
  readonly fixtureId = input.required<FixtureId>();
  readonly competitionUrl = input.required<CompetitionUrl>();

  private readonly facade = inject(MatchFacade);
  readonly fixture = this.facade.fixture;
  readonly data = this.facade.data;
  readonly error = this.facade.error;

  private readonly pageRefreshService = inject(PageRefreshService);
  private readonly visibilityObserverService = inject(
    VisibilityObserverService
  );

  loadFixtureEffect = effect(() => {
    const fixtureId = this.fixtureId();
    this.facade.loadFixture(fixtureId);
  });

  invalidUrlEffect = effect(() =>
    this.facade.handleInvalidUrl(this.competitionUrl())
  );

  ngOnInit(): void {
    this.visibilityObserverService.init();
    this.pageRefreshService.init({
      canRefresh: () => this.canRefresh(),
      refresh: () => this.refresh(),
    });
  }

  ngOnDestroy(): void {
    this.visibilityObserverService.stop();
    this.pageRefreshService.stop();
  }

  private canRefresh(): boolean {
    const today = moment().tz('Europe/Berlin').format('YYYY-MM-DD');
    const hasTodayValue = this.fixture()?.data.fixture.date.substring(0, 10);
    return today === hasTodayValue && !this.facade.isLoading();
  }

  private refresh(): void {
    this.facade.reloadFixture();
  }
}
