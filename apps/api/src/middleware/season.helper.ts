import moment from 'moment-timezone';

import { CompetitionId } from '@lib/models';

export const getSeason = (competition: CompetitionId = null): number => {
  const today = moment().tz('Europe/Berlin');
  const competitionId = Number(competition);
  const mlsId = 253;

  if (competitionId === mlsId) {
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
