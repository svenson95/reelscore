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
    main { @apply flex p-fb-padding-3; }
    reelscore-logo { 
      transform: translate(-50%, -50%);
      position: absolute;
      top: 50%;
      left: 50%;
    }
  `,
  template: `
    @if (isLoading() === true) {
    <reelscore-logo disabled />
    } @if (!isLoading()) {
    <header></header>
    }

    <main>
      <router-outlet />
    </main>

    @if (!isLoading()) {
    <footer></footer>
    }
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
