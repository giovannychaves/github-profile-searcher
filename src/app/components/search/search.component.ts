import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { GithubUserUtil } from 'src/app/models/github-user.model';

import { GithubRestApiService } from 'src/app/services/github/rest-api.service';
import { GithubUserDataService } from 'src/app/services/github/user-data.service';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnDestroy {
  private keyPressListener!: (event: KeyboardEvent) => void;
  inputValue: string = '';
  displayLoader: boolean = false;
  message$: Observable<{ message: string; type: 'warning' | 'error' | 'info' }>;

  constructor(
    private gitHubApiService: GithubRestApiService,
    private githubUserDataService: GithubUserDataService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.keyPressListener = this.handleKeyPress.bind(this);
    document.addEventListener('keypress', this.keyPressListener);
    this.message$ = this.messageService.message$;
  }

  ngOnDestroy(): void {
    document.removeEventListener('keypress', this.keyPressListener);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.searchUser();
  }

  searchUser(): void {
    if (this.inputValue) {
      this.displayLoader = true;

      const cachedUser = localStorage.getItem(this.inputValue);
      if (cachedUser) {
        this.githubUserDataService.setUserData(
          JSON.parse(cachedUser) as GithubUserUtil
        );
        this.router.navigate(['/profile'], {
          queryParams: { user: this.inputValue },
        });
        this.displayLoader = false;
      } else {
        this.gitHubApiService
          .getUser(this.inputValue)
          .pipe(catchError(this.handleError.bind(this)))
          .subscribe((data) => {
            console.log(data);
            localStorage.setItem(this.inputValue, JSON.stringify(data));
            this.githubUserDataService.setUserData(data);
            this.router.navigate(['/profile'], {
              queryParams: { user: this.inputValue },
            });
            this.displayLoader = false;
          });
      }
    } else {
      this.messageService.showMessage("Enter the user you want to search for, please.", 'info', 3000);
    }
  }

  private handleError(error: HttpErrorResponse) {
    let message: string = '';
    let messageType: 'warning' | 'error' | 'info' = 'error';

    if (error.status === 0) {
      message = 'Something bad happened, please try again later.';
      messageType = 'error';
    } else if (error.status === 404) {
      message = 'User not found, try another one.';
      messageType = 'warning';
    } else {
      message = 'Something bad happened, please try again later.';
      messageType = 'error';
    }

    this.messageService.showMessage(message, messageType, 3000);
    this.displayLoader = false;
    return throwError(
      () => new Error(`${message} Error body: ${JSON.stringify(error.error)}`)
    );
  }
}
