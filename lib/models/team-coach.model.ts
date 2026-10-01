type CoachBirth = {
  date: string;
  place: string;
  country: string;
};

type CoachTeam = {
  id: number;
  name: string;
  logo: string;
};

type CareerTeam = {
  id: number;
  name: string;
  logo: string;
};

type CareerItem = {
  team: CareerTeam;
  start: string; // DateString yyyy-MM-dd
  end: string; // DateString yyyy-MM-dd
};

export type TeamCoachDTO = {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: CoachBirth;
  nationality: string;
  height: string;
  weight: string;
  photo: string;
  team: CoachTeam;
  career: [CareerItem];
};

export interface GetAllTeamCoachesDTO {
  data: TeamCoachDTO[];
  length: number;
}
