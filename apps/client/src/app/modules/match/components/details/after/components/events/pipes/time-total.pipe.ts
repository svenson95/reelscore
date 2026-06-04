import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import type { EventWithResult} from '@lib/models';
import { timeTotal } from '@lib/models';

@Pipe({
  name: 'timeTotal',
  standalone: true,
})
export class TimeTotalPipe implements PipeTransform {
  transform(event: EventWithResult) {
    return timeTotal(event);
  }
}
