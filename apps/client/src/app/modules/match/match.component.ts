import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnChanges,
} from '@angular/core';

import { CompetitionUrl, FixtureId } from '@lib/models';

import { RouterView } from '../router-view';

import {
  MatchDetailsComponent,
  MatchHeaderComponent,
  PageHeaderComponent,
} from './components';
import { MatchFacade } from './match.facade';
import { SERVICE_PROVIDERS } from './services';
import { STORE_PROVIDERS } from './store';

@Component({
  selector: 'rs-match-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, MatchHeaderComponent, MatchDetailsComponent],
  providers: [MatchFacade, ...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { @apply w-full flex flex-col gap-5; }
  `,
  template: `
    @if (error()) {
    <section class="page-error">
      <p class="no-data">Es ist ein Fehler aufgetreten.</p>
    </section>
    } @else {
    <section rs-page-header class="animate-drop-from-top"></section>

    <section
      rs-match-header
      [data]="data()"
      [highlights]="fixture()?.highlights"
    ></section>

    <section rs-match-details></section>
    }
  `,
})
export class MatchComponent extends RouterView implements OnChanges {
  fixtureId = input.required<FixtureId>();
  competitionUrl = input.required<CompetitionUrl>();

  private facade = inject(MatchFacade);
  fixture = this.facade.fixture;
  data = this.facade.data;
  error = this.facade.error;

  async ngOnChanges(): Promise<void> {
    await this.facade.loadFixture(this.fixtureId());
  }

  invalidUrlEffect = effect(() =>
    this.facade.handleInvalidUrl(this.competitionUrl())
  );
}
