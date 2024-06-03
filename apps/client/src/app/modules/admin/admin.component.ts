import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply w-full flex flex-col gap-5; }
    .page-title { @apply text-center border-b-[1px] pb-2 mb-2; }
    div { @apply flex gap-5; }
    .sidebar { @apply flex flex-col flex-[1] min-w-[160px] gap-5; }
    .content { @apply flex-[3]; }
    section .group-title { @apply text-fb-color-text-2 border-b-[1px] pb-2 mb-2; }
    .group-title, li { @apply px-3; }
    li span:last-of-type { @apply float-right; }
  `,
  template: `
    <h3 class="page-title">ADMIN</h3>

    <div>
      <section class="sidebar">
        <section class="nav">
          <h4 class="group-title">Datenbank</h4>
          <ul>
            <li>Standings</li>
            <li>Fixtures</li>
            <li>Fixture-Statistics</li>
          </ul>
        </section>

        <section class="overview">
          <h4 class="group-title">Übersicht</h4>
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
      </section>

      <section class="content">content ...</section>
    </div>
  `,
})
export class AdminComponent {}
