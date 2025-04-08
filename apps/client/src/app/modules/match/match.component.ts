import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { BackButtonComponent } from '@app/shared';
import { CompetitionUrl, FixtureId } from '@lib/models';

import { RouterView } from '../router-view';

import { MatchDetailsComponent, MatchHeaderComponent } from './components';
import { MatchFacade } from './match.facade';
import { SERVICE_PROVIDERS } from './services';
import { STORE_PROVIDERS } from './store';

const ANGULAR_MODULES = [DatePipe, MatButtonModule];

@Component({
  selector: 'rs-match-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...ANGULAR_MODULES,
    BackButtonComponent,
    MatchHeaderComponent,
    MatchDetailsComponent,
  ],
  providers: [MatchFacade, ...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { @apply w-full flex flex-col gap-5; }
    section.page-header {
      @apply p-5;
      div { @apply flex gap-5; }
    }
    section.match-header {
      @apply px-5 sticky top-0 rs-bg-color z-10;
      margin-top: -1.25rem;
    }
    section.match-details { @apply max-w-rs-max-width w-full flex flex-col gap-5 mx-auto; }
    button { 
      --mdc-outlined-button-container-height: 36px;
      @apply rs-as-label; 
    }
    .spacer { @apply flex-1; }
    .date-placeholder {  @apply m-auto w-[36px] h-[12px] bg-gray-200 rounded; }
  `,
  template: `
    @if (error()) {
    <section class="page-error">
      <p class="no-data">Es ist ein Fehler aufgetreten.</p>
    </section>
    } @else {
    <section class="page-header animate-drop-from-top">
      <div>
        <rs-back-button />
        <button mat-stroked-button disabled>
          {{ routerDate() | date : 'dd.MM.yy' }}
        </button>

        <div class="spacer"></div>

        <button mat-stroked-button disabled>
          {{ routerDate() | date : 'ccc' }}
        </button>
        <button mat-stroked-button disabled>
          @let fixtureDate = fixture()?.data?.fixture?.date; @if (fixtureDate) {
          {{ fixtureDate | date : 'HH:mm' }} } @else {
          <div class="date-placeholder"></div>
          }
        </button>
      </div>
    </section>

    <section class="match-header">
      <rs-match-header [data]="data()" [highlights]="fixture()?.highlights" />
    </section>

    <section class="match-details">
      <rs-match-details />
    </section>
    }
  `,
})
export class MatchComponent extends RouterView implements OnChanges {
  fixtureId = input.required<FixtureId>();
  competitionUrl = input.required<CompetitionUrl>();

  private facade = inject(MatchFacade);
  fixture = this.facade.fixture;
  routerDate = this.facade.routerDate;
  data = this.facade.data;
  error = this.facade.fixtureStore.error;

  async ngOnChanges(): Promise<void> {
    await this.facade.fixtureStore.loadFixture(this.fixtureId());
  }

  invalidUrlEffect = effect(() =>
    this.facade.handleInvalidUrl(this.competitionUrl())
  );
}
