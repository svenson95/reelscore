import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

import { RouterView } from '../router-view';

import {
  CompetitionStandingsComponent,
  LastFixturesComponent,
  NextFixturesComponent,
  PageHeaderComponent,
  PlayerStatsComponent,
} from './components';
import { SERVICE_PROVIDERS } from './services';
import {
  CompetitionStandingsStore,
  LastFixturesStore,
  NextFixturesStore,
  STORE_PROVIDERS,
  TopScorersStore,
} from './store';

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
      mat-tab-header { @apply mx-3; }
    }
  `,
  template: `
    <nav aria-label="Page-Header Navigation" rs-page-header></nav>
    <section class="competition-data">
      <mat-tab-group animationDuration="150ms">
        <mat-tab>
          <ng-template mat-tab-label>
            <div class="tab-label-content">
              <mat-icon>playlist_add_check</mat-icon>
              <span class="tab-label-span">Ergebnisse</span>
            </div>
          </ng-template>
          <rs-competition-last-fixtures />
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <div class="tab-label-content">
              <mat-icon>playlist_play</mat-icon>
              <span class="tab-label-span">Spielplan</span>
            </div>
          </ng-template>
          <ng-template matTabContent>
            <rs-competition-next-fixtures />
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <div class="tab-label-content">
              <mat-icon>format_list_numbered</mat-icon>
              <span class="tab-label-span">Tabellen</span>
            </div>
          </ng-template>
          <ng-template matTabContent>
            <rs-competition-standings />
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <div class="tab-label-content">
              <mat-icon>format_list_numbered_rtl</mat-icon>
              <span class="tab-label-span">Statistiken</span>
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
export class CompetitionComponent extends RouterView {
  private readonly routerService = inject(Router);

  private readonly lastFixturesStore = inject(LastFixturesStore);
  private readonly nextFixturesStore = inject(NextFixturesStore);
  private readonly standingsStore = inject(CompetitionStandingsStore);
  private readonly topScorersStore = inject(TopScorersStore);

  leagueEffect = effect(async () => {
    const competition = this.leagueService.selectedLeague();
    if (!competition) return;
    await this.lastFixturesStore.loadLastFixtures(competition.id);
    await this.nextFixturesStore.loadNextFixtures(competition.id);
    await this.standingsStore.loadStandings(
      competition.id,
      new Date().toISOString()
    );
    await this.topScorersStore.loadTopScorers(competition.id);
  });
}
