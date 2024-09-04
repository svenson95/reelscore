import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { getCompetitionLogo } from '@app/models';
import {
  BreakpointObserverService,
  ROUTE_SERVICE_PROVIDER,
} from '@app/services';
import { CompetitionId } from '@lib/models';
import { OptimizedImageComponent } from '../../components';
import { RouterView } from '../router-view';

@Component({
  selector: 'reelscore-league',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, OptimizedImageComponent],
  providers: [ROUTE_SERVICE_PROVIDER],
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
          Letzte Spiele
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>calendar_month</mat-icon>
            } @else { Spielplan }
          </ng-template>
          Anstehende Spiele
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

  getCompetitionLogo = (id: CompetitionId) => getCompetitionLogo(id, false);
}
