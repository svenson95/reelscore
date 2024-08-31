import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'reelscore-optimized-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  styles: `img { object-fit: contain; height: revert-layer; margin: auto; }`,
  template: `
    <img
      [ngSrc]="source()"
      [alt]="alternate()"
      priority
      [width]="width()"
      [height]="height()"
      #imgRef
    />
  `,
})
export class OptimizedImageComponent implements AfterViewChecked {
  source = input.required<string>();
  alternate = input.required<string>();

  width = input<string>();
  height = input<string>();

  img = viewChild.required<ElementRef<HTMLImageElement>>('imgRef');

  ngAfterViewChecked() {
    this.img().nativeElement.classList.add(
      `max-w-[${this.width()}px]`,
      `max-h-[${this.height()}px]`
    );
  }
}
