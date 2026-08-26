import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getCurrentYear } from '@lib/shared';

import { LogoComponent } from '../logo/logo.component';

type FooterLink = {
  label: string;
  route: string;
};

@Component({
  selector: 'footer[rs-footer-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  styles: `
    :host {
      @apply block border-t-[1px] border-rs-border-color-2 text-rs-font-size-body-2
        px-6 py-12 lg:px-12 lg:py-16;
    }

    .footer-content {
      @apply mx-auto grid max-w-[1200px] gap-10
        md:grid-cols-[2fr_1fr];
    }

    .footer-brand {
      @apply max-w-md;
    }

    .footer-logo {
      @apply mb-5;
    }

    .footer-description {
      @apply text-rs-color-text-2;
    }

    .footer-navigation {
      @apply flex flex-col gap-10
        lg:grid lg:grid-cols-[max-content_1fr] lg:gap-x-16;
    }

    .footer-nav-container {
      @apply min-w-[150px];
    }

    .footer-heading {
      @apply mb-4 font-bold uppercase text-rs-color-primary;
    }

    .footer-list {
      @apply flex flex-col items-start gap-3;
    }

    .footer-link {
      @apply transition-opacity hover:opacity-70;
    }

    .footer-navigation a[href^='mailto:'] {
      @apply break-all;
    }

    .footer-bottom {
      @apply mx-auto mt-12 flex max-w-[1200px] items-center
        border-t-[1px] border-rs-border-color-2 pt-6
        text-rs-color-text-2;
    }
  `,
  template: `
    <div class="footer-content">
      <section class="footer-brand">
        <rs-logo class="footer-logo" />

        <p class="footer-description">
          Live-Fußball, Ergebnisse, Tabellen, Statistiken und detaillierte
          Analysen. <br />
          Für ausgewählte europäische und internationale Wettbewerbe,
          Mannschaften und Spieler.
        </p>
      </section>

      <div class="footer-navigation">
        <section>
          <h2 class="footer-heading">Kontakt</h2>

          <div class="footer-list">
            <a class="footer-link" href="mailto:reelscore.team@gmail.com">
              reelscore.team&#64;gmail.com
            </a>
          </div>
        </section>

        <nav class="footer-nav-container" aria-label="Rechtliche Informationen">
          <h2 class="footer-heading">Weitere Links</h2>

          <div class="footer-list">
            @for (link of LINKS; track link.route) {
            <a class="footer-link">
              {{ link.label }}
            </a>
            }
          </div>
        </nav>
      </div>
    </div>

    <div class="footer-bottom">
      <span>2024 - {{ currentYear }} reelscore</span>
    </div>
  `,
})
export class FooterComponent {
  protected readonly currentYear: number = getCurrentYear();

  protected readonly LINKS: FooterLink[] = [
    {
      label: 'Impressum',
      route: '/impressum',
    },
    {
      label: 'Datenschutz',
      route: '/datenschutz',
    },
    {
      label: 'Einstellungen',
      route: '/einstellungen',
    },
  ];
}
