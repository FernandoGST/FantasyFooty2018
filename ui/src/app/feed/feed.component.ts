import { Component, OnInit } from "@angular/core";

import { FeedService, FeedResponse } from "../feed.service";
import { UserService } from "../user.service";

@Component({
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.css"]
})
export class FeedComponent implements OnInit {
  private serviceFeed: FeedService;
  constructor(private servicefeed: FeedService, private userService: UserService) {
    this.serviceFeed = servicefeed;
  }
  public fav = false;
  public user = { favorite_tournaments: {} };
  public date = "2018/07/28";
  public feed?: FeedResponse;
  public message = null;
  ngOnInit() {
    this.loadFeed();
    const user = this.userService.getLoggedInUser();
    console.log(user);
    if (user != null) {
      this.user = user;
    }
    console.log(this.user.favorite_tournaments);
  }
  private loadFeed = function() {
    this.serviceFeed.getFeedAsync(this.date).subscribe(
      (data: FeedResponse) => {
        this.message = null;
        this.feed = data;
        this.feed.sport_events.map(sportEvent => {
          const date = new Date(sportEvent.scheduled as string);
          sportEvent.scheduled = date;
        });
      },
      error => {
        this.feed = [];
        this.message = "No events scheduled for this date.";
      }
    );
  };
  toggleFav() {
    this.fav = !this.fav;
    console.log(this.fav);
  }
  onDateChange(value) {
    // tslint:disable-next-line:max-line-length
    const d = new Date(value);
    this.date =
      d.getFullYear() +
      "/" +
      d
        .getMonth()
        .toString()
        .padStart(2, "0") +
      "/" +
      d
        .getDate()
        .toString()
        .padStart(2, "0");
    console.log("changed", this.date);
    this.loadFeed();
  }
}
