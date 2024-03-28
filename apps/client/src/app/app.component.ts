import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from './components';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'futbet-root',
  styles: `
    :host {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      @apply text-fb-color-text-1;
    }
    header { @apply flex bg-fb-color-green-1 p-fb-padding-3 pb-0; }
    main { @apply flex bg-white p-fb-padding-3; }
    footer { @apply flex bg-gray-200 justify-center px-fb-padding-3 py-10; }
  `,
  template: `
    <header></header>

    <main>
      <router-outlet />
    </main>

    <footer></footer>
  `,
})
export class AppComponent {}
