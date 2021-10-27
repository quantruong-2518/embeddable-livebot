import { Component, OnInit } from '@angular/core';

import { ChatService } from '../../services/chat.service';

import { messages } from './mockdata';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss'],
})
export class LiveChatComponent implements OnInit {
  messages = messages;
  message = '';

  constructor(private readonly _service: ChatService) {}

  ngOnInit(): void {
    this._service.getMessage().subscribe((msg) => console.log('msg', msg));
  }

  trackByIndex(index: number): number {
    return index;
  }

  sendMessage() {
    const initMessage = {
      type: 'text',
      from: 1,
      content: this.message,
    };
    this.messages.push(initMessage);
    this.message = '';

    this._service.sendMessage('Hello !');

    const convo = document.getElementsByClassName(
      'conversation'
    )[0] as HTMLDivElement;
    this.scrollToBottom(convo);
  }

  scrollToBottom(el: HTMLElement) {
    el.scrollTop = el.scrollHeight;
  }
}
