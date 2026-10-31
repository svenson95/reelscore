import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { LeagueService } from '@app/shared';

import { LogoComponent } from '../logo/logo.component';

import { CompetitionSelectComponent } from './competition-select.component';

const MAT_MODULES = [MatButtonModule];

@Component({
  selector: 'header[rs-header-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...MAT_MODULES,
    RouterLink,
    LogoComponent,
    CompetitionSelectComponent,
  ],
  styles: `
    :host {
      @apply relative z-[200] border-b-[1px] p-3;
    }

    .wrapper {
      @apply flex items-center justify-between lg:px-3;
    }

    .logo-link {
      --mat-button-filled-container-color: transparent;

      @apply min-w-0 pl-0 pr-0;
    }

    h1 {
      @apply m-0;
    }
  `,
  template: `
    <div class="wrapper">
      <h1>
        <a
          class="logo-link"
          mat-flat-button
          [routerLink]="['/']"
          aria-label="Zur Startseite"
        >
          <rs-logo [showLoadingIndicator]="true" />
        </a>
      </h1>

      <nav
        aria-label="Competition-Select Navigation"
        rs-competition-select
        [selectedCompetition]="selectedCompetition()"
      ></nav>
    </div>
  `,
})
export class HeaderComponent {
  private readonly competitionService = inject(LeagueService);
  readonly selectedCompetition = this.competitionService.selectedLeague;
}
