import { COMPETITION_ID } from '@reelscore-sdk/constants';
import { isCompetitionWithMultipleGroups } from '@reelscore-sdk/helpers';
import type { StandingRanks, StandingsDTO } from '@reelscore-sdk/models';

export const getStandingsGroups = (
  standings: StandingsDTO,
  homeTeamId?: number | null,
  awayTeamId?: number | null
): StandingRanks[][] => {
  const groups = standings.league.standings ?? [];

  if (standings.league.id !== COMPETITION_ID.MAJOR_LEAGUE_SOCCER) {
    return groups;
  }

  const easternConference = groups.find(
    (group) => group[0]?.group === 'Eastern Conference'
  );
  const westernConference = groups.find(
    (group) => group[0]?.group === 'Western Conference'
  );

  if (!easternConference || !westernConference) {
    return groups.filter((group, index) => {
      const groupName = group[0]?.group;
      const isConference =
        groupName === 'Eastern Conference' ||
        groupName === 'Western Conference';

      return (
        isConference &&
        groups.findIndex((candidate) => candidate[0]?.group === groupName) ===
          index
      );
    });
  }

  const overallStandings = [...easternConference, ...westernConference]
    .sort(compareMlsStandings)
    .map((team, index) => ({ ...team, rank: index + 1, group: 'MLS' }));

  if (homeTeamId != null && awayTeamId != null) {
    const matchConference = [easternConference, westernConference].find(
      (group) =>
        group.some((standing) => standing.team.id === homeTeamId) &&
        group.some((standing) => standing.team.id === awayTeamId)
    );
    const matchTeamIds = new Set([homeTeamId, awayTeamId]);
    const matchOverallStandings = overallStandings.filter((standing) =>
      matchTeamIds.has(standing.team.id)
    );

    if (!matchConference) {
      const matchConferenceStandings = [easternConference, westernConference]
        .map((group) =>
          group.filter((standing) => matchTeamIds.has(standing.team.id))
        )
        .filter((group) => group.length > 0);

      return [...matchConferenceStandings, matchOverallStandings];
    }

    const matchConferenceStandings = matchConference.filter((standing) =>
      matchTeamIds.has(standing.team.id)
    );

    return [matchConferenceStandings, matchOverallStandings];
  }

  return [easternConference, westernConference, overallStandings];
};

const compareMlsStandings = (
  firstTeam: StandingRanks,
  secondTeam: StandingRanks
): number => {
  const comparisons = [
    secondTeam.points - firstTeam.points,
    secondTeam.all.win - firstTeam.all.win,
    secondTeam.goalsDiff - firstTeam.goalsDiff,
    secondTeam.all.goals.for - firstTeam.all.goals.for,
    secondTeam.away.goals.for -
      secondTeam.away.goals.against -
      (firstTeam.away.goals.for - firstTeam.away.goals.against),
    secondTeam.away.goals.for - firstTeam.away.goals.for,
    secondTeam.home.goals.for -
      secondTeam.home.goals.against -
      (firstTeam.home.goals.for - firstTeam.home.goals.against),
    secondTeam.home.goals.for - firstTeam.home.goals.for,
  ];

  for (const comparison of comparisons) {
    if (comparison !== 0) {
      return comparison;
    }
  }

  return firstTeam.team.name.localeCompare(secondTeam.team.name);
};

export const showHomeAndAwayStandings = (standings: StandingsDTO): boolean => {
  return (
    standings.league.standings?.length === 3 &&
    !isCompetitionWithMultipleGroups(
      standings.league.id,
      standings.league.season
    )
  );
};
