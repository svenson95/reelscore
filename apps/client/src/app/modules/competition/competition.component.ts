import { Component, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

import { OptimizedImageComponent } from '@app/components';
import { getCompetitionLogo } from '@app/models';
import { BreakpointObserverService } from '@app/services';
import { RouterView } from '../router-view';
import {
  CompetitionStandingsComponent,
  LastFixturesComponent,
  NextFixturesComponent,
} from './components';
import { SERVICE_PROVIDERS } from './services';
import {
  CompetitionStandingsStore,
  LastFixturesStore,
  NextFixturesStore,
  STORE_PROVIDERS,
} from './store';

@Component({
  selector: 'reelscore-league',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    OptimizedImageComponent,
    LastFixturesComponent,
    NextFixturesComponent,
    CompetitionStandingsComponent,
  ],
  providers: [...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { @apply w-full; }
    :host ::ng-deep .mat-mdc-tab-body-wrapper { @apply mt-5; }
    .header { @apply w-fit bg-white rounded-full p-8 mx-auto mb-5; }
  `,
  template: `
    <section class="header">
      @if (competition()?.id) {
      <reelscore-optimized-image
        [source]="getCompetitionLogo(competition()!.id)"
        [alternate]="competition()!.label"
        width="64"
        height="64"
      />
      }
    </section>
    <section class="data">
      <mat-tab-group animationDuration="0">
        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>article</mat-icon>
            } @else { Ergebnisse }
          </ng-template>
          <reelscore-competition-last-fixtures />
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>calendar_month</mat-icon>
            } @else { Spielplan }
          </ng-template>
          <ng-template matTabContent>
            <reelscore-competition-next-fixtures />
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>format_list_numbered</mat-icon>
            } @else { Tabellen }
          </ng-template>
          <ng-template matTabContent>
            <reelscore-competition-standings />
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>assessment</mat-icon>
            } @else { Statistiken }
          </ng-template>
          <ng-template matTabContent>
            <p class="no-data">Torschützen & Vorlagen Tabellen</p>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </section>
  `,
})
export class CompetitionComponent extends RouterView {
  competition = this.leagueService.selectedLeague;
  bos = inject(BreakpointObserverService);
  isMobile = this.bos.isMobile;
  routerService = inject(Router);

  lastFixturesStore = inject(LastFixturesStore);
  nextFixturesStore = inject(NextFixturesStore);
  standingsStore = inject(CompetitionStandingsStore);

  getCompetitionLogo = getCompetitionLogo;

  leagueEffect = effect(
    async () => {
      const competition = this.competition();
      if (!competition) return;
      await this.lastFixturesStore.loadLastFixtures(competition.id);
      await this.nextFixturesStore.loadNextFixtures(competition.id);
      await this.standingsStore.loadStandings(competition.id);
    },
    { allowSignalWrites: true }
  );
}
