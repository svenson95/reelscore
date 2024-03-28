import { Pipe, PipeTransform } from '@angular/core';

import { DayTime } from '../date-bar.component';

@Pipe({
  standalone: true,
  name: 'isToday',
})
export class IsTodayPipe implements PipeTransform {
  transform(value: DayTime): boolean {
    return new Date(value).getDate() === new Date().getDate();
  }
}
