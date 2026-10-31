import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: 'ng-template[rsTabPanel]' })
export class TabPanelDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
