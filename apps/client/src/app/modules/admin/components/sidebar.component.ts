import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-admin-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col w-[250px] shrink-0 gap-10; }
    .group-title { @apply text-fb-color-text-2 border-b-[1px] pb-2 mb-2; }
    .group-title, li { @apply px-3 py-1 text-fb-font-size-body-2; }
    li span:last-of-type { @apply float-right; }
  `,
  template: `
    <section class="nav">
      <h4 class="group-title">Übersicht</h4>
      <ul>
        <li>Standings</li>
        <li>Fixtures</li>
        <li>Fixture-Statistics</li>
      </ul>
    </section>

    <section class="nav">
      <h4 class="group-title">Daten laden</h4>
      <ul>
        <li>Standings</li>
        <li>Fixtures</li>
        <li>Fixture-Statistics</li>
      </ul>
    </section>

    <section class="overview">
      <h4 class="group-title">Details</h4>
      <ul>
        <li>
          <span>Datensätze insgesamt:</span>
          <span>4</span>
        </li>
        <li>
          <span>Standings Datensätze:</span>
          <span>2</span>
        </li>
        <li>
          <span>Fixtures Datensätze:</span>
          <span>1</span>
        </li>
        <li>
          <span>Fixture-Statistics Datensätze:</span>
          <span>1</span>
        </li>
      </ul>
    </section>
  `,
})
export class SidebarComponent {}
