import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { TIMEZONE } from '@reelscore-sdk/helpers';
import type {
  FixtureDTO,
  SearchResult,
  SearchResultGroup,
} from '@reelscore-sdk/models';

import {
  getCompetitionLogoSrcSet,
  getTeamLogoSrcSet,
  ResponsiveImageComponent,
  RoundLabelPipe,
  TeamNamePipe,
  ThemeService,
} from '@app/shared';

const MAT_MODULES = [MatListModule];

@Component({
  selector: 'rs-search-results',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...MAT_MODULES, DatePipe, RoundLabelPipe, ResponsiveImageComponent],
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
      @apply truncate font-medium leading-normal text-rs-font-size-body-3;
    }

    .result-content {
      @apply flex flex-col;
    }

    .result-title-row {
      @apply flex;
    }

    .result-metadata-row {
      @apply flex min-w-0 items-center justify-between gap-2;
    }

    .result-competition-round {
      @apply flex min-w-0 flex-wrap gap-1;
    }

    .result-subtitle {
      @apply truncate leading-normal text-rs-font-size-small text-rs-color-text-2;
    }

    .result-metadata,
    .result-date {
      @apply leading-normal text-rs-font-size-small text-rs-color-text-2;
    }

    .result-date {
      @apply shrink-0;
    }
  `,
  template: `
    @for (group of groups(); track group.type) {
    <section class="group">
      <div class="group-title">{{ group.label }}</div>
      <mat-action-list class="results-list">
        @for (result of group.results; track result.id) {
        <button mat-list-item type="button" (click)="clickEvent.emit(result)">
          <div class="result-icon" matListItemIcon>
            <rs-responsive-image
              [source]="getCompetitionLogo(result)"
              [sourceSet]="getCompetitionLogoSet(result)"
              altText="league logo"
              [width]="24"
              [height]="24"
            />
          </div>

          <div class="result-content" matListItemTitle>
            <div class="result-title-row">
              <span class="result-title">
                {{ getResultTitle(result) }}
              </span>
            </div>

            <div class="result-metadata-row">
              <div class="result-competition-round">
                <span class="result-subtitle">
                  {{ getResultSubtitle(result) }}
                </span>

                @if (result.type === 'fixtures') {
                <span class="result-metadata" aria-hidden="true">·</span>
                <span class="result-metadata">
                  {{
                    result.data.league.round
                      | roundLabel
                        : {
                            type: 'header',
                            id: result.data.league.id,
                            season: result.data.league.season
                          }
                  }}
                </span>
                }
              </div>

              @if (result.type === 'fixtures') {
              <span class="result-date">
                {{
                  result.data.fixture.timestamp * 1000
                    | date : 'dd.MM' : timeZone
                }}
              </span>
              }
            </div>
          </div>
        </button>
        }
      </mat-action-list>
    </section>
    }
  `,
})
export class SearchResultsComponent {
  readonly groups = input.required<SearchResultGroup[]>();
  protected readonly timeZone = TIMEZONE;

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
          this.teamNamePipe.transform(
            result.data.teams.home.name ?? '',
            'short'
          ),
          this.teamNamePipe.transform(
            result.data.teams.away.name ?? '',
            'short'
          ),
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
}
