import { Component, OnInit } from '@angular/core';

import { ChatService } from 'src/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  messages = [];

  constructor(private _socket: ChatService) {}

  ngOnInit() {
    this._socket.getMessage().subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  trackByIndex(index: number, id: string) {
    return index;
  }

  sendMessage(msg: string) {
    this._socket.sendMessage(msg);
  }
}
