import type {
  MongoDbId,
  TeamId,
  TeamLogo,
  TeamName,
  VenueId,
} from '@reelscore-sdk/models';

export type TeamDetails = {
  id: TeamId;
  name: TeamName;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: TeamLogo;
};
export type TeamVenue = {
  id: VenueId;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
};
export type TeamDTO = {
  _id: MongoDbId;
  team: TeamDetails;
  venue: TeamVenue;
  createdAt: Date;
  updatedAt: Date;
};

export interface GetAllTeamsDTO {
  data: TeamDTO[];
  length: number;
}
