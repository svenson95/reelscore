import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { LeagueService, MAT_TAB_ANIMATION_DURATION } from '@app/shared';

import { CompetitionRouteContext } from './state/competition-route-context';

import {
  CompetitionStandingsComponent,
  LastFixturesComponent,
  NextFixturesComponent,
  PageHeaderComponent,
  PlayerStatsComponent,
} from './components';
import { SERVICE_PROVIDERS } from './data-access';
import {
  CompetitionStandingsStore,
  LastFixturesStore,
  NextFixturesStore,
  STORE_PROVIDERS,
  TopScorersStore,
} from './state';

@Component({
  selector: 'rs-competition-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTabsModule,
    MatIconModule,
    CompetitionStandingsComponent,
    LastFixturesComponent,
    NextFixturesComponent,
    PageHeaderComponent,
    PlayerStatsComponent,
  ],
  providers: [...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host ::ng-deep {
      mat-tab-header {
        @apply mx-3;
      }
    }

    :host {
      @apply min-h-[70vh];
    }
  `,
  template: `
    <nav aria-label="Page-Header Navigation" rs-page-header></nav>

    <section class="competition-data" data-testid="competition-page">
      <mat-tab-group
        [animationDuration]="animationDuration"
        [style.--tab-count]="COMPETITION_TABS_LENGTH"
        [style.--active-tab-index]="selectedTabIndex()"
        (selectedIndexChange)="selectedTabIndex.set($event)"
      >
        <mat-tab>
          <ng-template mat-tab-label>
            <div class="tab-label-content" aria-label="Ergebnisse">
              <mat-icon>playlist_add_check</mat-icon>
            </div>
          </ng-template>

          <rs-competition-last-fixtures />
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <div class="tab-label-content" aria-label="Spielplan">
              <mat-icon>playlist_play</mat-icon>
            </div>
          </ng-template>

          <ng-template matTabContent>
            <rs-competition-next-fixtures />
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <div class="tab-label-content" aria-label="Tabellen">
              <mat-icon>format_list_numbered</mat-icon>
            </div>
          </ng-template>

          <ng-template matTabContent>
            <rs-competition-standings />
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <div class="tab-label-content" aria-label="Spieler-Statistiken">
              <mat-icon>format_list_numbered_rtl</mat-icon>
            </div>
          </ng-template>

          <ng-template matTabContent>
            <rs-competition-player-stats />
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </section>
  `,
})
export class CompetitionPage extends CompetitionRouteContext {
  private readonly leagueService = inject(LeagueService);

  private readonly lastFixturesStore = inject(LastFixturesStore);
  private readonly nextFixturesStore = inject(NextFixturesStore);
  private readonly standingsStore = inject(CompetitionStandingsStore);
  private readonly topScorersStore = inject(TopScorersStore);

  readonly animationDuration = MAT_TAB_ANIMATION_DURATION;

  readonly COMPETITION_TABS_LENGTH = 4;
  readonly selectedTabIndex = signal<number>(0);

  private readonly leagueEffect = effect(() => {
    const competition = this.leagueService.selectedLeague();

    if (!competition) return;

    this.lastFixturesStore.loadLastFixtures(competition.id);
    this.nextFixturesStore.loadNextFixtures(competition.id);
    this.standingsStore.loadStandings(competition.id, new Date().toISOString());
    this.topScorersStore.loadTopScorers(competition.id);
  });
}
