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
    :host { @apply p-rs-padding-3 border-b-[1px] border-rs-color-orange rs-bg-color z-[15] relative; }
    .wrapper { @apply flex items-center justify-between lg:px-rs-padding-3; }
  `,
  template: `
    <div class="wrapper">
      <a mat-button [routerLink]="['/']">
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
