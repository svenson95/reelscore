import { Pipe, PipeTransform } from '@angular/core';

import { DayTime, TODAY } from '../../../models';

@Pipe({
  standalone: true,
  name: 'isToday',
})
export class IsTodayPipe implements PipeTransform {
  transform(value: DayTime): boolean {
    const date = new Date(value);
    const sameDate = date.getDate() === TODAY.getDate();
    const sameMonth = date.getMonth() === TODAY.getMonth();
    return sameDate && sameMonth;
  }
}
