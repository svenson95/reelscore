import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { getCompetitionLogo } from '@app/models';
import { ROUTE_SERVICE_PROVIDER } from '@app/services';
import { OptimizedImageComponent } from '../../components';
import { RouterView } from '../router-view';

@Component({
  selector: 'reelscore-league',
  standalone: true,
  imports: [MatTabsModule, OptimizedImageComponent],
  providers: [ROUTE_SERVICE_PROVIDER],
  styles: `
    :host { @apply w-full; }
    .header { @apply w-fit bg-white rounded-full p-8 mx-auto mb-5; }
    :host ::ng-deep .mat-mdc-tab-body.mat-mdc-tab-body-active { 
      @apply bg-white; 

      .mat-mdc-tab-body-content { @apply p-5 text-center; }
    }
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
    <section class="league-content">
      <mat-tab-group disablePagination>
        <mat-tab label="Ergebnisse"> Letzte Spiele </mat-tab>
        <mat-tab label="Spielplan"> Anstehende Spiele </mat-tab>
        <mat-tab label="Tabellen">
          Tabelle, Heimtabelle & Auswärtstabelle
        </mat-tab>
        <mat-tab label="Statistiken"> Torschützen & Vorlagen Tabellen </mat-tab>
      </mat-tab-group>
    </section>
  `,
})
export class LeagueComponent extends RouterView {
  competition = this.leagueService.selectedLeague;

  getCompetitionLogo = getCompetitionLogo;
}
