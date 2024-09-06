import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { OptimizedImageComponent } from '@app/components';
import { getCompetitionLogo } from '@app/models';
import { BreakpointObserverService } from '@app/services';
import { RouterView } from '../router-view';
import { LastFixturesComponent } from './components';
import { NextFixturesComponent } from './components/next-fixtures.component';
import { SERVICE_PROVIDERS } from './services';
import { STORE_PROVIDERS } from './store';

@Component({
  selector: 'reelscore-league',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    OptimizedImageComponent,
    LastFixturesComponent,
    NextFixturesComponent,
  ],
  providers: [...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { @apply w-full; }
    :host ::ng-deep {
      // TODO: remove this placeholder styling if content is loaded from api
      .mat-mdc-tab-body.mat-mdc-tab-body-active {
        @apply bg-white; 
        .mat-mdc-tab-body-content { @apply p-5 text-center; }
      }
    }

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
      <mat-tab-group>
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
          <reelscore-competition-next-fixtures />
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>format_list_numbered</mat-icon>
            } @else { Tabellen }
          </ng-template>
          Tabelle, Heimtabelle & Auswärtstabelle
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>assessment</mat-icon>
            } @else { Statistiken }
          </ng-template>
          Torschützen & Vorlagen Tabellen
        </mat-tab>
      </mat-tab-group>
    </section>
  `,
})
export class CompetitionComponent extends RouterView {
  competition = this.leagueService.selectedLeague;
  bos = inject(BreakpointObserverService);
  isMobile = this.bos.isMobile;

  getCompetitionLogo = getCompetitionLogo;
}
