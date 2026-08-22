import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { LeagueService } from '../../services';

import { LogoComponent } from '../logo/logo.component';

import { CompetitionSelectComponent } from './components';

const EXTERNAL_IMPORTS = [RouterLink, MatButtonModule];

@Component({
  selector: 'header[rs-header-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...EXTERNAL_IMPORTS, LogoComponent, CompetitionSelectComponent],
  styles: `
    :host {
      @apply relative z-[200] border-b-[1px] border-rs-color-primary p-3;
    }

    .wrapper {
      @apply flex items-center justify-between lg:px-3;
    }

    .logo-link {
      --mat-button-filled-container-color: transparent;

      @apply min-w-0 pl-0 pr-3;
    }
  `,
  template: `
    <div class="wrapper">
      <a
        class="logo-link"
        mat-flat-button
        [routerLink]="['/']"
        aria-label="Zur Startseite"
      >
        <rs-logo [showLoadingIndicator]="true" />
      </a>

      <nav
        aria-label="Competition-Select Navigation"
        rs-competition-select
        [selectedCompetition]="selectedCompetition()"
      ></nav>
    </div>
  `,
})
export class HeaderComponent {
  private competitionService = inject(LeagueService);
  selectedCompetition = this.competitionService.selectedLeague;
}
