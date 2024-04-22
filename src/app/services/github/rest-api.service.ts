import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { HttpService } from '../http/http.service';
import { RequestOptions } from 'src/app/models/http.model';
import { GithubUser, GithubUserUtil } from 'src/app/models/github-user.model';
import { GithubRepo, GithubRepoUtil } from 'src/app/models/github-repo.model';

@Injectable({
  providedIn: 'root',
})
export class GithubRestApiService {
  private requestOptions: RequestOptions = {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: '',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  };

  constructor(private httpService: HttpService) {}

  getUser(username: string): Observable<GithubUserUtil> {
    return this.httpService
      .get<GithubUser>(
        `https://api.github.com/users/${username}`,
        this.requestOptions
      )
      .pipe(
        map((data) => {
          const user = data as unknown as GithubUser;
          const mappedUser: GithubUserUtil = {
            login: user.login,
            email: user.email,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
            repos_url: user.repos_url,
            name: user.name,
            location: user.location,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
          };
          return mappedUser;
        })
      );
  }

  getUserRepos(url: string): Observable<GithubRepoUtil[]> {
    return this.httpService.get<GithubRepo>(url, this.requestOptions).pipe(
      map((data) => {
        const repos = data as unknown as GithubRepo[];
        const mappedRepos: GithubRepoUtil[] = repos.map((repo) => ({
          name: repo.name,
          html_url: repo.html_url,
          description: repo.description,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          private: repo.private,
        }));

        return mappedRepos;
      })
    );
  }
}
