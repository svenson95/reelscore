import { CompetitionId } from '@lib/models';
import moment from 'moment-timezone';

export const getSeason = (competition: CompetitionId): number => {
  const today = moment().tz('Europe/Berlin');
  const mlsId = 253;

  if (competition === mlsId) {
    return today.year();
  } else {
    return calculateSeasonForRegularCompetition(today);
  }
};

const calculateSeasonForRegularCompetition = (today: moment.Moment): number => {
  const cutoff = today.clone().month(5).date(9);
  if (today.isSameOrBefore(cutoff)) {
    return today.year() - 1;
  } else {
    return today.year();
  }
};
