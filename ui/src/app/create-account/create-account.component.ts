import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.css"]
})
export class CreateAccountComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}
  user = {};
  password = "";
  otherpassword = "!";
  message = {};
  objectkeys = Object.keys;
  ngOnInit() {
    if (this.userService.getLoggedInUser() != null) {
      this.router.navigate(["user-config"]);
    }
  }

  onEmailChange(email) {
    this.user["email"] = email;
  }

  onPasswordChange(password) {
    this.password = password;
    console.log(this.otherpassword, this.password);
    if (this.otherpassword !== this.password) {
      this.message["passwords must match"] = true;
    } else {
      if (this.message["passwords must match"] != null) {
        delete this.message["passwords must match"];
      }
    }
  }

  onPasswordRepeatChange(password) {
    this.otherpassword = password;
    console.log(this.otherpassword, this.password);
    if (this.otherpassword !== this.password) {
      this.message["passwords must match"] = true;
    } else {
      if (this.message["passwords must match"] != null) {
        delete this.message["passwords must match"];
      }
    }
  }

  onCreateClick() {
    console.log(this.user["email"], this.password);
    this.userService.createUserAsync(this.user["email"], this.password).subscribe(
      response => {
        this.userService.tryLoginAsync(this.user["email"], this.password);
      },
      error => {
        console.log(error);
        if (error.status === 409) {
          this.message["Email is taken."] = true;
        }
      }
    );
  }
}
