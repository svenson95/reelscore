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
import { RouterModule, RouterOutlet } from '@angular/router';

import { FooterComponent, HeaderComponent } from './shared';

@Component({
  selector: 'rs-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  styles: `
    :host {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    rs-logo { 
      transform: translate(-50%, -50%);
      position: absolute;
      top: 50%;
      left: 50%;
    }
  `,
  template: `
    @if(!isRouterLoading()) {
    <header rs-header-content></header>
    }
    <main>
      <router-outlet />
    </main>
    <footer rs-footer-content></footer>
  `,
})
export class AppComponent implements AfterViewInit {
  private outlet = viewChild.required<RouterOutlet>(RouterOutlet);
  private destroyRef = inject(DestroyRef);

  isRouterLoading = signal<boolean>(true);

  public ngAfterViewInit(): void {
    this.outlet()
      ?.activateEvents.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isRouterLoading.set(false));
  }
}
