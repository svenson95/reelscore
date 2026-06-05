type CoachBirth = {
  date: String;
  place: String;
  country: String;
};

type CoachTeam = {
  id: Number;
  name: String;
  logo: String;
};

type CareerTeam = {
  id: Number;
  name: String;
  logo: String;
};

type CareerItem = {
  team: CareerTeam;
  start: String; // DateString yyyy-MM-dd
  end: String; // DateString yyyy-MM-dd
};

export type TeamCoachDTO = {
  id: Number;
  name: String;
  firstname: String;
  lastname: String;
  age: Number;
  birth: CoachBirth;
  nationality: String;
  height: String;
  weight: String;
  photo: String;
  team: CoachTeam;
  career: [CareerItem];
};

export interface GetAllTeamCoachesDTO {
  data: TeamCoachDTO[];
  length: number;
}
