import { Directive, ElementRef, inject, OnInit } from '@angular/core';

@Directive({
  selector: '[rsHideHeader]',
  standalone: true,
})
export class HideHeaderDirective implements OnInit {
  elementRef = inject(ElementRef);

  ngOnInit(): void {
    const headerElement = this.elementRef.nativeElement.children[0];
    headerElement.style.display = 'none';
  }
}
