import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from './components';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'futbet-root',
  template: `
    <header
      class="bg-fb-color-green-1 flex items-center font-semibold p-fb-padding-3 pb-0 relative justify-between"
    ></header>

    <main class="bg-white flex p-fb-padding-3">
      <router-outlet />
    </main>

    <footer
      class="flex justify-center px-fb-padding-3 py-10 bg-gray-200"
    ></footer>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      @apply text-fb-color-text-1;
    }
  `,
})
export class AppComponent {}
