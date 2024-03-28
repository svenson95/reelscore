import { TODAY } from '../../../models';

import { IsTodayPipe } from './is-today.pipe';

describe('IsTodayPipe', () => {
  const pipe = new IsTodayPipe();
  const mock = TODAY.getTime();

  it('should return true if date is today', () => {
    expect(pipe.transform(mock)).toBe(true);
  });

  it('should return false if date is not today', () => {
    const notToday = new Date('01/01/2000').getTime();
    expect(pipe.transform(notToday)).toBe(false);
  });
});
