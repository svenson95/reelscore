import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, RouterOutlet } from '@angular/router';

import { FooterComponent, HeaderComponent } from './components';

@Component({
  selector: 'futbet-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    FooterComponent,
  ],
  styles: `
    :host {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      @apply text-fb-color-text-1;
    }
    main { @apply flex bg-fb-color-green-1-light px-fb-padding-3; }
    mat-spinner { @apply mx-auto my-10; }
  `,
  template: `
    <header></header>

    <main>
      <router-outlet />
    </main>

    <footer></footer>
  `,
})
export class AppComponent implements AfterViewInit {
  private outlet = viewChild(RouterOutlet);

  isLoading = signal<boolean>(true);

  destroyRef = inject(DestroyRef);

  public ngAfterViewInit(): void {
    this.outlet()
      ?.activateEvents.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isLoading.set(false));
  }
}
