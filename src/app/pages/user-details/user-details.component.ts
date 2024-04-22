import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, catchError, throwError } from 'rxjs';
import { GithubRepoUtil } from 'src/app/models/github-repo.model';
import { GithubUserUtil } from 'src/app/models/github-user.model';
import { GithubRestApiService } from 'src/app/services/github/rest-api.service';

import { GithubUserDataService } from 'src/app/services/github/user-data.service';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnDestroy, OnInit {
  githubUrl: string = 'https://github.com/';
  userData: GithubUserUtil | null = null;
  userDataSubscription!: Subscription;
  userRepos: GithubRepoUtil[] = [];
  userReposDefault: GithubRepoUtil[] = [];
  sortedBy: string = 'aToZ';
  filterInputValue: string = '';
  displayLoader: boolean = true;
  message$: Observable<{ message: string; type: 'warning' | 'error' | 'info' }>;

  constructor(
    private gitHubApiService: GithubRestApiService,
    private githubUserDataService: GithubUserDataService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.getCachedInfo();

    if (this.userData) {
      this.getRepos();
    } else {
      this.userDataSubscription = this.githubUserDataService
        .getUserData()
        .subscribe((data) => {
          if (data) {
            this.userData = data;
            this.getRepos();
          }
        });
    }

    document.addEventListener('keypress', this.handleKeyPress);
    this.message$ = this.messageService.message$;
  }

  ngOnInit(): void {
    if (this.userData == null) this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.userDataSubscription?.unsubscribe();
    document.removeEventListener('keypress', this.handleKeyPress);
  }

  onInput(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  getCachedInfo(): void {
    this.route.queryParams.subscribe((params) => {
      const paramValue = params['user'];
      if (paramValue) {
        if (this.userData === null) {
          const cachedUser = localStorage.getItem(paramValue);
          if (cachedUser) {
            this.userData = JSON.parse(cachedUser);
          } else {
            this.router.navigate(['/']);
          }
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const inputField = document.getElementById('filter') as HTMLInputElement;
      const activeElement = document.activeElement as HTMLElement;
      if (document.activeElement === inputField) {
        activeElement.blur();
      }
    }
  }

  getRepos() {
    const cachedRepos = localStorage.getItem(`${this.userData?.login!}Repos`);
    if (cachedRepos) {
      this.userRepos = JSON.parse(cachedRepos);
      this.userReposDefault = JSON.parse(cachedRepos);
      this.displayLoader = false;
    } else {
      this.gitHubApiService
        .getUserRepos(this.userData?.repos_url!)
        .pipe(catchError(this.handleError.bind(this)))
        .subscribe((data) => {
          console.log('repos', data);
          localStorage.setItem(
            `${this.userData?.login!}Repos`,
            JSON.stringify(data)
          );
          this.userRepos = data;
          this.userReposDefault = data;
          this.displayLoader = false;
        });
    }
  }

  private handleError(error: HttpErrorResponse) {
    let message: string = '';
    let messageType: 'warning' | 'error' | 'info' = 'error';

    if (error.status === 0) {
      // Front
      message = 'Unable to get repos, please try again later.';
      messageType = 'error';
    } else {
      // Back
      message = 'Unable to get repos, please try again later.';
      messageType = 'error';
    }

    this.messageService.showMessage(message, messageType, 5000);
    this.displayLoader = false;
    return throwError(
      () => new Error(`${message} Error body: ${JSON.stringify(error.error)}`)
    );
  }

  sortByStars(increasing: boolean): void {
    this.userRepos.sort((a, b) => {
      return increasing
        ? b.stargazers_count - a.stargazers_count
        : a.stargazers_count - b.stargazers_count;
    });
    this.sortedBy = increasing ? 'increasingStars' : 'decreasingStars';
  }

  sortByName(increasing: boolean): void {
    this.sortedBy = increasing ? 'aToZ' : 'zToA';
    this.userRepos.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return increasing ? -1 : 1;
      }
      if (nameA > nameB) {
        return increasing ? 1 : -1;
      }
      return 0;
    });
  }

  filterByStars(): void {
    if (this.filterInputValue) {
      if (Number(this.filterInputValue) === 0) {
        this.userRepos = [...this.userReposDefault];
      } else {
        if (this.userRepos.length === 0) {
          this.userRepos = [...this.userReposDefault];
        }
        this.userRepos = this.userRepos.filter(
          (repo) => repo.stargazers_count >= Number(this.filterInputValue)
        );
      }
    } else {
      this.userRepos = [...this.userReposDefault];
    }

    this.sortRepos();
  }

  sortRepos(): void {
    switch (this.sortedBy) {
      case 'aToZ':
        this.sortByName(true);
        break;
      case 'zToA':
        this.sortByName(false);
        break;
      case 'increasingStars':
        this.sortByStars(true);
        break;
      case 'decreasingStars':
        this.sortByStars(false);
        break;
      default:
        this.sortByName(true);
        break;
    }
  }
}
