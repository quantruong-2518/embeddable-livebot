import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { ChatService } from '../../services/chat.service';

import { messages } from './mockdata';

interface SuggestionAnswer {
  _id: string;
  content: string;
  type: string;
}
interface Suggestion {
  answers: Array<SuggestionAnswer>;
  createdAt: string;
  status: number;
  title: string;
  updatedAt: string;
  _id: string;
  type: string;
}

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss'],
})
export class LiveChatComponent implements OnInit {
  messages = messages;
  message = '';

  private readonly _subscription = new Subscription();

  constructor(private readonly _service: ChatService) {}

  ngOnInit(): void {
    this._subscription.add(
      this._service.getMessage().subscribe((suggestions: Suggestion[]) => {
        if (suggestions.length) {
          this.messages = [...this.messages, ...suggestions];
        } else {
          const notFoundMsg = {
            content: 'Không có dữ liệu câu hỏi phù hợp',
            type: 'text',
          };

          this.messages = [...this.messages, notFoundMsg];
        }

        this.scrollToBottom();
      })
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  trackByIndex(index: number): number {
    return index;
  }

  sendMessage() {
    if (this.message) {
      this._service.sendMessage({
        content: this.message,
      });

      const initMessage = {
        type: 'text',
        from: 1,
        content: this.message,
      };
      this.messages.push(initMessage);
      this.message = '';

      this.removeOldSuggestions();

      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const convo = document.getElementsByClassName(
        'conversation'
      )[0] as HTMLDivElement;
      convo.scrollTop = convo.scrollHeight;
    }, 0);
  }

  getSugAnswer(sug: Suggestion) {
    const pickedSuggestion = {
      from: 1,
      type: 'text',
      content: sug.title,
    };

    const answers = sug.answers.map((asw) => {
      return { ...asw, type: 'text' };
    });

    this.messages = [...this.messages, pickedSuggestion, ...answers];

    this.removeOldSuggestions();
  }

  removeOldSuggestions() {
    this.messages = this.messages.filter((msg) => msg.type !== 'suggestion');
  }
}
