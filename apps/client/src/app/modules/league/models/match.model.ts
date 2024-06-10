import { FixtureDTO } from '@lib/models';

import { Competition } from '../../../models/competition.model';

export interface CompetitionFixtures extends Competition {
  fixtures: FixtureDTO[];
}
