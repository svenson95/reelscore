import { Pipe, PipeTransform } from '@angular/core';

import { EventWithResult, timeTotal } from '@lib/models';

@Pipe({
  name: 'timeTotal',
  standalone: true,
})
export class TimeTotalPipe implements PipeTransform {
  transform(event: EventWithResult) {
    return timeTotal(event);
  }
}
