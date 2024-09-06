import { MongoDbId } from './mongodb.model';

export type Team = { id: TeamId; name: TeamName; logo: TeamLogo };
export type TeamId = number;
export type TeamName = string;
export type TeamLogo = string;
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
  id: number;
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
