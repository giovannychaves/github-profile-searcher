import { Component, Input } from '@angular/core';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() message: string = '';
  @Input() type: 'warning' | 'error' | 'info' = 'info';

  getStyleClass(): string {
    return `${this.type}Message`;
  }
}
