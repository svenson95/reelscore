import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnChanges,
  untracked,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

import {
  BackButtonComponent,
  CompetitionData,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';
import { CompetitionUrl, FixtureId } from '@lib/models';

import { RouterView } from '../router-view';

import { MatchDetailsComponent, MatchHeaderComponent } from './components';
import { SERVICE_PROVIDERS } from './services';
import { FixtureStore, STORE_PROVIDERS } from './store';

const ANGULAR_MODULES = [DatePipe, MatButtonModule];

@Component({
  selector: 'reelscore-match-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...ANGULAR_MODULES,
    BackButtonComponent,
    MatchHeaderComponent,
    MatchDetailsComponent,
  ],
  providers: [...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { @apply w-full flex flex-col gap-5; }
    section.page-header {
      @apply p-5;
      div { @apply flex gap-5; }
    }
    section.match-header {
      @apply px-5 sticky top-0 rs-bg-color z-10;
      margin-top: -1.25rem;
    }
    section.data { @apply max-w-rs-max-width w-full flex flex-col gap-5 mx-auto; }
    button { 
      --mdc-outlined-button-container-height: 36px;
      @apply rs-as-label; 
    }
    .spacer { @apply flex-1; }
    .date-placeholder {  @apply m-auto w-[36px] h-[12px] bg-gray-200 rounded; }
  `,
  template: `
    @if (fixtureStore.error()) {
    <p class="no-data">Es ist ein Fehler aufgetreten.</p>
    } @else {
    <section class="page-header animate-drop-from-top">
      <div>
        <reelscore-back-button />
        <button mat-stroked-button disabled>
          {{ routerDate() | date : 'dd.MM.yy' }}
        </button>

        <div class="spacer"></div>

        <button mat-stroked-button disabled>
          {{ routerDate() | date : 'ccc' }}
        </button>
        <button mat-stroked-button disabled>
          @if (data()?.fixture?.date) {
          {{ data()!.fixture.date | date : 'HH:mm' }}
          } @else {
          <div class="date-placeholder"></div>
          }
        </button>
      </div>
    </section>

    <section class="match-header">
      <reelscore-match-header
        [data]="data()"
        [highlights]="fixture()?.highlights"
      />
    </section>

    <section class="data">
      <reelscore-match-details />
    </section>
    }
  `,
})
export class MatchComponent extends RouterView implements OnChanges {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  fixtureStore = inject(FixtureStore);
  fixture = this.fixtureStore.fixture;
  data = computed(() => this.fixtureStore.fixture()?.data);

  fixtureId = input.required<FixtureId>();
  competitionUrl = input.required<CompetitionUrl>();

  routerDate = computed(() => {
    const route = this.activatedRoute.snapshot;
    return route.params['date'];
  });

  invalidUrlEffect = effect(() => {
    const fixture = this.data();
    const activeRoute = untracked(this.competitionUrl);
    const leagueData = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.url === activeRoute
    );
    if (!fixture || !leagueData) return;

    const fixtureLeagueId = fixture.league.id;
    const invalidUrl = fixtureLeagueId !== leagueData.id;
    if (invalidUrl) {
      const fixtureId = fixture.fixture.id;
      const league = SELECT_COMPETITION_DATA_FLAT.find(
        (d) => d.id === fixture.league.id
      );
      if (!league) return;
      this.redirectTo({ league, fixtureId });
    }
  });

  async ngOnChanges(): Promise<void> {
    await this.fixtureStore.loadFixture(this.fixtureId());
  }

  private redirectTo({
    league,
    fixtureId,
  }: {
    league: CompetitionData;
    fixtureId: FixtureId;
  }) {
    if (!league) throw Error('Unexpected League not found');
    this.router.navigate(['../..', league.url, fixtureId], {
      relativeTo: this.activatedRoute,
    });
  }
}
