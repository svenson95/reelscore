import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

import { BreakpointObserverService } from '@app/shared';

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
    .competition-data {
      @apply mx-3;
    }
  `,
  template: `
    <nav aria-label="Page-Header Navigation" rs-page-header></nav>
    <section class="competition-data">
      <mat-tab-group animationDuration="150ms">
        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>article</mat-icon>
            } @else { Ergebnisse }
          </ng-template>
          <rs-competition-last-fixtures />
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>calendar_month</mat-icon>
            } @else { Spielplan }
          </ng-template>
          <ng-template matTabContent>
            <rs-competition-next-fixtures />
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>format_list_numbered</mat-icon>
            } @else { Tabellen }
          </ng-template>
          <ng-template matTabContent>
            <rs-competition-standings />
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>assessment</mat-icon>
            } @else { Statistiken }
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
  bos = inject(BreakpointObserverService);
  isMobile = this.bos.isMobile;
  routerService = inject(Router);

  lastFixturesStore = inject(LastFixturesStore);
  nextFixturesStore = inject(NextFixturesStore);
  standingsStore = inject(CompetitionStandingsStore);

  leagueEffect = effect(async () => {
    const competition = this.leagueService.selectedLeague();
    if (!competition) return;
    await this.lastFixturesStore.loadLastFixtures(competition.id);
    await this.nextFixturesStore.loadNextFixtures(competition.id);
    await this.standingsStore.loadStandings(competition.id);
  });
}
