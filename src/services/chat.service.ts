import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  sendMessage(msg: { content: string }) {
    this.socket.emit('new-question', msg);
  }

  getMessage() {
    return this.socket.fromEvent('answer-question');
  }
}
