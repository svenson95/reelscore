import { Pipe, PipeTransform } from '@angular/core';

import { DayTime, TODAY } from '../../../models';

@Pipe({
  standalone: true,
  name: 'isToday',
})
export class IsTodayPipe implements PipeTransform {
  transform(value: DayTime): boolean {
    return new Date(value).getDate() === TODAY.getDate();
  }
}
