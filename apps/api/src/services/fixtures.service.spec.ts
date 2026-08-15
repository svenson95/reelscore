import moment from 'moment-timezone';

import { TIMEZONE } from '@lib/shared';

import { Fixtures } from '../models';

import { FixturesService } from './fixtures.service';

describe('FixturesService', () => {
  let service: FixturesService;

  const execMock = jest.fn();
  const leanMock = jest.fn();
  const sortMock = jest.fn();

  beforeEach(() => {
    service = new FixturesService();

    jest.clearAllMocks();

    execMock.mockResolvedValue([]);

    leanMock.mockReturnValue({
      exec: execMock,
    });

    sortMock.mockReturnValue({
      lean: leanMock,
    });

    jest.spyOn(Fixtures, 'find').mockReturnValue({
      sort: sortMock,
    } as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findByDate', () => {
    it('should query fixtures within the selected day in Europe/Berlin', async () => {
      await service.findByDate('2026-08-15');

      const expectedStart = moment
        .tz('2026-08-15', 'YYYY-MM-DD', true, TIMEZONE)
        .startOf('day')
        .unix();

      const expectedEnd = moment
        .tz('2026-08-15', 'YYYY-MM-DD', true, TIMEZONE)
        .startOf('day')
        .add(1, 'day')
        .unix();

      expect(Fixtures.find).toHaveBeenCalledWith({
        'fixture.timestamp': {
          $gte: expectedStart,
          $lt: expectedEnd,
        },
      });
    });

    it('should sort fixtures chronologically', async () => {
      await service.findByDate('2026-08-15');

      expect(sortMock).toHaveBeenCalledWith({
        'fixture.timestamp': 1,
      });
    });

    it('should reject an invalid date', async () => {
      await expect(service.findByDate('invalid-date')).rejects.toThrow(
        'Invalid fixture date: invalid-date'
      );

      expect(Fixtures.find).not.toHaveBeenCalled();
    });

    it('should query the full 25-hour day when daylight saving time ends', async () => {
      const date = '2026-10-25';

      const startOfDay = moment
        .tz(date, 'YYYY-MM-DD', true, TIMEZONE)
        .startOf('day');

      const startOfNextDay = startOfDay.clone().add(1, 'day');

      await service.findByDate(date);

      expect(Fixtures.find).toHaveBeenCalledWith({
        'fixture.timestamp': {
          $gte: startOfDay.unix(),
          $lt: startOfNextDay.unix(),
        },
      });

      const dayLengthInHours =
        (startOfNextDay.unix() - startOfDay.unix()) / 60 / 60;

      expect(dayLengthInHours).toBe(25);
    });
  });
});
