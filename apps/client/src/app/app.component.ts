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

import { FooterComponent, HeaderComponent } from './shared';

@Component({
  selector: 'reelscore-root',
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
    }
    reelscore-logo { 
      transform: translate(-50%, -50%);
      position: absolute;
      top: 50%;
      left: 50%;
    }
  `,
  template: `
    @if(!isRouterLoading()) {
    <header></header>
    }
    <main>
      <router-outlet />
    </main>
    <footer></footer>
  `,
})
export class AppComponent implements AfterViewInit {
  private outlet = viewChild.required<RouterOutlet>(RouterOutlet);
  isRouterLoading = signal<boolean>(true);
  destroyRef = inject(DestroyRef);

  public ngAfterViewInit(): void {
    this.outlet()
      ?.activateEvents.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isRouterLoading.set(false));
  }
}
