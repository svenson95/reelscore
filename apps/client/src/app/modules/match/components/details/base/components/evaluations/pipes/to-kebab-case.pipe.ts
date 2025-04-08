import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rsToKebabCase',
})
export class ToKebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().split('_').join('-');
  }
}
