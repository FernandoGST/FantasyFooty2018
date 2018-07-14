import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FeedService } from "../feed.service";
export class SportEvent {
  scheduled: string;
  competitors: {
    id: string;
    name: string;
    qualifier: "home" | "away";
  }[];
  venue: {
    id: string;
    name: string;
    capacity: number;
    city_name: string;
    country_name: string;
    map_coordinates: string;
    country_code: string;
  };
}
export class EventConditions {
  referee: {
    name: string;
    nationality: string;
  };
  attendance: number;
}
export class EventStatus {
  status: string;
  match_status?: string;
  home_score?: number;
  away_score?: number;
  winner_id: string;
  period_scores?: {
    home_score: number;
    away_score: number;
    type: string;
    number: string;
  }[];
}
export class TeamStat {
  id: string;
  name: string;
  qualifier: "home" | "away";
  statistics: object;
  players: {
    name: string;
    goals_scored: string;
    yellow_cards: number;
    red_cards: number;
  }[];
}
export class Stats {
  teams: TeamStat[];
}
export class EventStats {
  sport_event: SportEvent;
  sport_event_conditions: EventConditions;
  sport_event_status: EventStatus;
  statistics: Stats;
}

@Component({
  selector: "app-game-stats",
  templateUrl: "./game-stats.component.html",
  styleUrls: ["./game-stats.component.css"]
})
export class GameStatsComponent implements OnInit {
  objectKeys = Object.keys;
  obj: {
    [key: string]: {};
  };
  event_stats: EventStats | null = null;
  event_id: string;
  constructor(private route: ActivatedRoute, private feedService: FeedService) {}

  isWinner(id: string): boolean | undefined {
    if (this.event_stats.sport_event_status.winner_id == null) {
      return undefined;
    }
    return this.event_stats.sport_event_status.winner_id === id;
  }
  getTeamScore(id: string): number {
    const competitor = this.event_stats.sport_event.competitors.find(com => com.id === id);
    console.log(competitor);
    // tslint:disable-next-line:max-line-length
    return competitor.qualifier === "home" ? this.event_stats.sport_event_status.home_score : this.event_stats.sport_event_status.away_score;
  }
  getTeamStats(id: string): TeamStat | {} {
    if (this.event_stats.statistics == null) {
      return { statistics: {} };
    }
    return this.event_stats.statistics.teams.find(com => com.id === id);
  }
  getTeam(id: string): TeamStat {
    return this.event_stats.statistics.teams.find(com => com.id === id);
  }
  setObj(key, value) {
    this.obj[key] = value;
  }
  getSchedule() {
    return new Date(this.event_stats.sport_event.scheduled);
  }
  getRef() {
    if (this.event_stats.sport_event_conditions.referee != null) {
      return {
        name: this.event_stats.sport_event_conditions.referee.name,
        nationality: this.event_stats.sport_event_conditions.referee.nationality
      };
    }
    return {
      name: null,
      nationality: null
    };
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.event_id = params["event_id"];
      this.feedService.getEventData(this.event_id).subscribe((event_stats: EventStats) => {
        this.event_stats = event_stats;
      });
    });
  }
}
