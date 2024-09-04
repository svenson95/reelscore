import { FixtureDTO } from '@lib/models';
import { Competition } from '../../../models';

export interface CompetitionWithFixtures extends Competition {
  fixtures: FixtureDTO[];
}
