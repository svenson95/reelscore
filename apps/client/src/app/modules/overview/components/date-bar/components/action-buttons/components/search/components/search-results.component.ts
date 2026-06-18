import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';

import {
  ResponsiveImageComponent,
  TeamNamePipe,
  ThemeService,
  getCompetitionLogoSrcSet,
  getTeamLogoSrcSet,
} from '@app/shared';
import type { FixtureDTO, SearchResult, SearchResultGroup } from '@lib/models';

const MAT_MODULES = [MatListModule];

@Component({
  selector: 'rs-search-results',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...MAT_MODULES, ResponsiveImageComponent],
  styles: `
    :host {
      @apply mt-rs2 max-h-[60dvh];
    }

    .group {
      @apply mt-rs1 first:mt-0;
    }

    .group-title {
      @apply mb-1 text-rs-font-size-small font-semibold text-rs-color-text-2;
    }

    .results-list {
      @apply py-0;
    }

    .result-icon {
      --mat-list-list-item-leading-icon-start-space: 12px;
      --mat-list-list-item-leading-icon-end-space: 24px;
    }

    .result-title {
      @apply truncate font-medium text-rs-font-size-body-2;
    }

    .result-subtitle {
      @apply truncate text-rs-font-size-small text-rs-color-text-2;
    }

    .result-season {
      @apply text-rs-font-size-small text-rs-color-text-2;
    }
  `,
  template: `
    @for (group of groups(); track group.type) {
    <section class="group">
      <div class="group-title">{{ group.label }}</div>
      <mat-nav-list class="results-list">
        @for (result of group.results; track result.id) {
        <a mat-list-item (click)="clickEvent.emit(result)">
          <div class="result-icon" matListItemIcon>
            <rs-responsive-image
              [source]="getCompetitionLogo(result)"
              [sourceSet]="getCompetitionLogoSet(result)"
              altText="league logo"
              [width]="24"
              [height]="24"
            />
          </div>

          <div class="result-content flex flex-col" matListItemTitle>
            <div class="flex">
              <span class="result-title leading-normal">
                {{ getResultTitle(result) }}
              </span>
            </div>

            <div class="flex gap-2">
              <span class="result-subtitle leading-normal">
                {{ getResultSubtitle(result) }}
              </span>

              <span class="result-season leading-normal">
                {{ getResultSeason(result) }}
              </span>
            </div>
          </div>
        </a>
        }
      </mat-nav-list>
    </section>
    }
  `,
})
export class SearchResultsComponent {
  readonly groups = input.required<SearchResultGroup[]>();

  private readonly teamNamePipe = inject(TeamNamePipe);
  private readonly themeService = inject(ThemeService);

  readonly clickEvent = output<SearchResult>();

  getCompetitionLogo(result: SearchResult): string {
    if (result.type === 'competitions') {
      return result.data.league.logo;
    }

    if (result.type === 'fixtures') {
      return (result.data as FixtureDTO).league.logo;
    }

    return '';
  }

  getCompetitionLogoSet(result: SearchResult): string {
    switch (result.type) {
      case 'competitions':
      case 'fixtures':
        return getCompetitionLogoSrcSet(
          result.data.league.id,
          24,
          this.themeService.isSystemDark()
        );

      case 'teams':
        return getTeamLogoSrcSet(result.data.team.id, 48);
    }
  }

  getResultTitle(result: SearchResult): string {
    switch (result.type) {
      case 'fixtures':
        return [
          this.teamNamePipe.transform(result.data.teams.home.name ?? ''),
          this.teamNamePipe.transform(result.data.teams.away.name ?? ''),
        ]
          .filter(Boolean)
          .join(' - ');

      case 'competitions':
        return result.data.league.name ?? '';

      case 'teams':
        return this.teamNamePipe.transform(result.data.team.name ?? '');
    }
  }

  getResultSubtitle(result: SearchResult): string {
    switch (result.type) {
      case 'fixtures':
        return result.data.league.name ?? '';

      case 'competitions':
        return result.data.league.country ?? '';

      case 'teams':
        return '';
    }
  }

  getResultSeason(result: SearchResult): string {
    if (result.type === 'fixtures') {
      const season = Number(String(result.data.league.season).substring(2, 4));

      return `${season}/${season + 1}`;
    }

    return '';
  }
}
