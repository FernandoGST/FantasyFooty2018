import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
export interface ISportEvent {
  id: string;
  scheduled: string | Date;
  start_time_tbd: boolean;
  status: "closed" | "open";
  tournament_round: {
    type: string;
    number: number;
    group: string;
  };
  season: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    year: number;
    tournament_id: string;
  };
  tournament: {
    id: string;
    name: string;
    sport: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
      country_code: string;
    };
  };
  competitors: {
    id: string;
    name: string;
    country: string;
    country_code: string;
    abbreviation: string;
    qualifier: string;
    metadata?: {
      baseHomeColor: string;
      textHomeColor: string;
    };
  }[];
  venue: {
    id: string;
    name: string;
    capacity: number;
    city_name: string;
    country_name: string;
    map_coordinates: number[];
    country_code: string;
  };
}
export interface ITournamentResponse {
  tournaments: {
    name: string;
    id: string
  }[];
}
export interface FeedResponse {
  sport_events: ISportEvent[];
}

@Injectable()
export class FeedService {
  private key = "zxm2efvs57fvqu35h8rmzbd6";
  private parameters: {
    year: number;
    month: number;
    day: number;
  };
  private feed: ISportEvent[];
  private http: HttpClient;
  // tslint:disable-next-line:max-line-length

  constructor(private Http: HttpClient) {
    this.http = Http;
  }

  public getFeedAsync = function(date: string) {
    const dateSplit = date.split("/");
    this.parameters = {
      year: dateSplit[0],
      month: dateSplit[1],
      day: dateSplit[2]
    };
    console.log(this.parameters);
    // tslint:disable-next-line:max-line-length
    const url = `http://localhost:8000/rely?request=https://api.sportradar.us/soccer-t3/am/en/schedules/${this.pad(this.parameters.year, 2)}-${this.pad(this.parameters.month, 2)}-${this.pad(
      this.parameters.day,
      2
    )}/schedule.json?api_key=${this.key}`;
    return this.http.get(url);
  };

  public getTeamData = function(teamId: string) {
    // tslint:disable-next-line:max-line-length
    const url = `http://localhost:8000/rely?request=https://api.sportradar.us/soccer-t3/am/en/teams/${teamId}/profile.json?api_key=${this.key}`;
    return this.http.get(url);
  };

  public getEventData = function(eventId: string) {
    // tslint:disable-next-line:max-line-length
    const url = `http://localhost:8000/rely?request=https://api.sportradar.us/soccer-t3/am/en/matches/${eventId}/summary.json?api_key=${this.key}`;
    return this.http.get(url);
  };

  public getTournaments = function() {
    const url = `http://localhost:8000/rely?request=https://api.sportradar.us/soccer-t3/am/en/tournaments.json?api_key=${this.key}`;
    return this.http.get(url);
  };

  private pad = function(num, size) {
    let s = num + "";
    while (s.length < size) {
      s = "0" + s;
    }
    return s;
  };
}
