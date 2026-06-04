import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'rsToKebabCase',
})
export class ToKebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().split('_').join('-');
  }
}
