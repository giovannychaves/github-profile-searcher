import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, timer } from 'rxjs';

import { Message } from 'src/app/models/messages.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageSubject = new BehaviorSubject<Message>({
    message: '',
    type: 'info',
  });
  message$: Observable<Message> = this.messageSubject.asObservable();

  showMessage(
    message: string,
    type: 'warning' | 'error' | 'info',
    duration: number = 3000
  ): void {
    this.messageSubject.next({ message, type });

    timer(duration)
      .pipe(tap(() => this.clearMessage()))
      .subscribe();
  }

  private clearMessage(): void {
    this.messageSubject.next({ message: '', type: 'info' });
  }
}
