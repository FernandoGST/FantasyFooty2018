declare var require: any;
import { Component, OnInit } from "@angular/core";
import { UserService, User } from "../user.service";
import { Router } from "@angular/router";
import { ITournamentResponse, FeedService } from "../feed.service";
const md5 = require("md5");
@Component({
  selector: "app-user-configuration",
  templateUrl: "./user-configuration.component.html",
  styleUrls: ["./user-configuration.component.css"]
})
export class UserConfigurationComponent implements OnInit {
  constructor(private userService: UserService, private router: Router, private feedService: FeedService) {}
  objectKeys = Object.keys;
  user: User | null;
  image = "";
  tlist: { name: string; id: string }[];
  Tournaments: ITournamentResponse;
  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
    if (this.user == null) {
      this.router.navigate(["login"]);
    }
    this.feedService.getTournaments().subscribe((tournament: ITournamentResponse) => {
      this.tlist = tournament.tournaments;
      const names = {};
      this.tlist.forEach(t => {
        names[t.name] = t.id;
      });
      const nList = [];
      Object.keys(names).forEach(key => {
        nList.push({ name: key, id: names[key] });
      });
      this.tlist = nList;
      console.log(this.tlist);
    });
    this.image = "https://www.gravatar.com/avatar/" + md5(this.user.email) + "?s=200";
  }
  onNameChange(name: string) {
    this.user.full_name = name;
  }
  onEmailChange(email: string) {
    this.user.email = email;
    this.image = "https://www.gravatar.com/avatar/" + md5(this.user.email) + "?s=200";
  }
  onDOBChange(dob: string) {
    console.log(dob);
    this.user.dob = dob;
  }
  onCheckBoxClick(id: string, name: string) {
    if (this.user.favorite_tournaments[name] == null) {
      this.user.favorite_tournaments[name] = true;
    } else {
      delete this.user.favorite_tournaments[name];
    }
  }
  onDeleteAccountClick() {
    this.userService.deleteUserAsync(this.user.email);
  }
  onSaveClick() {
    this.userService.updateUserAsync(this.user.email, this.user);
  }
}
