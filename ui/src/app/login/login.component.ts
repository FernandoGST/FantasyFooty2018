import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  login: {
    email: string;
    password: string;
  } = {
    email: null,
    password: null
  };
  constructor(private userService: UserService, private router: Router) {}
  ngOnInit() {
    if (this.userService.getLoggedInUser() != null) {
      this.router.navigate(["feed"]);
    }
  }
  onEmailChange(email: string) {
    this.login.email = email;
  }
  onPasswordChange(password: string) {
    this.login.password = password;
  }
  onLogInClick() {
    this.userService.tryLoginAsync(this.login.email, this.login.password);
  }
}
