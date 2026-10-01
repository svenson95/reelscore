import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import { timeTotal } from '@reelscore-sdk/helpers';
import type { EventWithResult } from '@reelscore-sdk/models';

@Pipe({
  name: 'timeTotal',
  standalone: true,
})
export class TimeTotalPipe implements PipeTransform {
  transform(event: EventWithResult) {
    return timeTotal(event);
  }
}
