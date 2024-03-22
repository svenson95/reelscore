import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'futbet-root',
  template: `
    <header
      class="bg-fb-color-green-2 flex items-center font-semibold px-fb-padding-1 py-3 relative justify-between"
    ></header>

    <main class="bg-fb-color-green-2 flex p-fb-padding-3">
      <router-outlet />
    </main>

    <footer
      class="flex justify-between px-fb-padding-1 py-10 bg-gray-700"
    ></footer>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      @apply text-fb-color-white;
    }
  `,
})
export class AppComponent {}
