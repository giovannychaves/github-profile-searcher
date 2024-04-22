import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GithubUserUtil } from 'src/app/models/github-user.model';

@Injectable({
  providedIn: 'root',
})
export class GithubUserDataService {
  private userData = new BehaviorSubject<GithubUserUtil | null>(null);

  setUserData(user: GithubUserUtil): void {
    this.userData.next(user);
  }

  getUserData(): BehaviorSubject<GithubUserUtil | null> {
    return this.userData;
  }
}
