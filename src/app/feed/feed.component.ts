import { Component, OnInit } from '@angular/core';

import { FeedService, FeedResponse } from '../feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  private serviceFeed: FeedService;
  constructor(private servicefeed: FeedService) {
    this.serviceFeed = servicefeed;
  }
  public feed?: FeedResponse;
  ngOnInit() {
    this.serviceFeed.getFeedAsync('2018/05/10').subscribe((data: FeedResponse) => {
      console.log(data.sport_events);

      this.feed = data;
    });
  }

  onTeamCardClick(competitor, event) {
    console.log(competitor, event.srcElement.popover());
    this.serviceFeed.getTeamData(competitor.id).subscribe((teamData: { jerseys: { base: string; number: string }[] }) => {
      let d = JSON.stringify(teamData);
    });
  }
}
