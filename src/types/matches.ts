export interface Match {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  dateEvent: string;
  strTime: string;
  strVenue: string;
  strLeague: string;
}

export interface MatchesResponse {
  events: Match[];
} 