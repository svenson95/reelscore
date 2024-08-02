import { FixtureDTO } from '@lib/models';
import { Competition } from '../../../models';

export interface CompetitionFixtures extends Competition {
  fixtures: FixtureDTO[];
}
