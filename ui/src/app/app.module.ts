import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { FeedComponent } from './feed/feed.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FeedService } from './feed.service';
import { HttpClientModule } from '@angular/common/http';
import { GameStatsComponent } from './game-stats/game-stats.component';
import { FormsModule } from '@angular/forms';
import { UserConfigurationComponent } from './user-configuration/user-configuration.component';
import { UserService } from './user.service';
const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'game-stats/:event_id', component: GameStatsComponent },
  {
    path: 'feed',
    component: FeedComponent
  },
  {
    path: 'user-config',
    component: UserConfigurationComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [AppComponent, CreateAccountComponent, PageNotFoundComponent, LoginComponent, FeedComponent, GameStatsComponent, UserConfigurationComponent],
  imports: [
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
  ],
  providers: [FeedService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {}
