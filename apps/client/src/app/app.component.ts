import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild,
  inject,
  signal,
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
    header { @apply flex p-fb-padding-3 pb-0; }
    main { @apply flex bg-fb-color-green-1-light p-fb-padding-3; }
    footer { @apply flex justify-center px-fb-padding-3 py-10; }
    mat-spinner { @apply mx-auto my-10; }
  `,
  template: `
    <header></header>

    <main>
      <router-outlet />
      @if (isLoading()) { <mat-spinner /> }
    </main>

    <footer></footer>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild(RouterOutlet)
  private outlet!: RouterOutlet;

  isLoading = signal<boolean>(true);

  destroyRef = inject(DestroyRef);

  public ngAfterViewInit(): void {
    this.outlet.activateEvents
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isLoading.set(false));
  }
}
