import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './components/search/search.component';

import { HttpService } from './services/http/http.service';
import { GithubRestApiService } from './services/github/rest-api.service';
import { GithubUserDataService } from './services/github/user-data.service';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { RepoCardComponent } from './components/repo-card/repo-card.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MessageComponent } from './components/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    UserDetailsComponent,
    RepoCardComponent,
    LoaderComponent,
    MessageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [HttpService, GithubRestApiService, GithubUserDataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
