import { CompetitionId, StandingsDTO } from '@lib/models';
import { APP_DATA } from '../../middleware';
import { Standings } from '../../models';

export const getStandings = async (
  id: CompetitionId,
  queryDate: string | null
): Promise<StandingsDTO | null> => {
  const query: object = {
    'league.id': id,
    'league.season': APP_DATA.season,
  };

  if (queryDate) {
    const [year, month, day] = queryDate.split('-').map((e) => Number(e));
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setDate(date.getDate() + 1);
    query['createdAt'] = { $lte: date };
  }

  const doc = await Standings.findOne(query).sort({ _id: -1 });
  return doc ?? null;
};
