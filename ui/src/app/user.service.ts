import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

export class User {
  email: string;
  dob: string;
  favorite_tournaments: {
    [id: string]: boolean;
  };
  full_name: string;
  password: string;
}
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token"
  })
};
const url = "http://localhost:8000/users";
@Injectable()
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}
  getAllAsync() {
    return this.http.get(url);
  }
  getUserAsync(email) {
    return this.http.get(url + "?email=" + email);
  }
  createUserAsync(email, password) {
    return this.http.post(url, { email: email, password: password });
  }
  updateUserAsync(email: string, userObject: User) {
    this.http.put(url, userObject, httpOptions).subscribe(
      (user: User | null) => {
        if (user != null) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          location.reload();
        } else {
          alert("Wrong credentials");
        }
      },
      error => {
        console.log(error);
        alert("Wrong credentials");
      }
    );
  }
  deleteUserAsync(email: string): void {
    console.log(url + "?email=" + email);
    this.http.delete(url + "?email=" + email).subscribe(
      response => {
        this.logOut();
      },
      error => {
        this.logOut();
      }
    );
  }
  getLoggedInUser() {
    const user = localStorage.getItem("currentUser");
    if (user != null) {
      return JSON.parse(user) as User;
    }
    return null;
  }
  tryLoginAsync(email, password) {
    const loginUrl = url + "/login";
    this.http.post(loginUrl, [email, password], httpOptions).subscribe(
      (user: User | null) => {
        console.log(user);
        if (user != null) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          location.reload();
        } else {
          alert("Wrong credentials");
        }
      },
      error => {
        console.log(error);
        alert("Wrong credentials");
      }
    );
  }
  logOut() {
    localStorage.removeItem("currentUser");
    location.reload();
  }
}
