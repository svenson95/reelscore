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

import { FooterComponent, HeaderComponent, LogoComponent } from './shared';

@Component({
  selector: 'reelscore-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    FooterComponent,
    LogoComponent,
  ],
  styles: `
    :host {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    main { @apply p-fb-padding-3; }
    reelscore-logo { 
      transform: translate(-50%, -50%);
      position: absolute;
      top: 50%;
      left: 50%;
    }
  `,
  template: `
    @if (isRouterLoading() === true) {
    <reelscore-logo disabled />
    } @if (!isRouterLoading()) {
    <header></header>
    }

    <main>
      <router-outlet />
    </main>

    @if (!isRouterLoading()) {
    <footer></footer>
    }
  `,
})
export class AppComponent implements AfterViewInit {
  private outlet = viewChild(RouterOutlet);
  isRouterLoading = signal<boolean>(true);
  destroyRef = inject(DestroyRef);

  public ngAfterViewInit(): void {
    this.outlet()
      ?.activateEvents.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isRouterLoading.set(false));
  }
}
