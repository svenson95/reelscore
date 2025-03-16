import { Pipe, PipeTransform } from '@angular/core';

import { FixtureDTO, StatusShort } from '@lib/models';

@Pipe({
  name: 'isStatus',
  standalone: true,
})
export class IsStatusPipe implements PipeTransform {
  transform = (
    fixture: FixtureDTO,
    states: StatusShort[],
    negatedStates: StatusShort[] = []
  ): boolean => {
    const status = fixture.fixture.status.short;
    const isInStates = states.includes(status);
    const isNotInStates = !negatedStates.includes(status);
    return isInStates && isNotInStates ? true : false;
  };
}
