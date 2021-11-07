import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Suggestion } from 'src/utils/model/suggestion.model';

import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss'],
})
export class LiveChatComponent implements OnInit {
  messages: Array<any> = [
    {
      type: 'text',
      from: 1,
      content: `Chào mừng  đến với chatbot của Cảnh sát biển Việt Nam`,
    },
    {
      content: 'Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn',
      type: 'text',
      from: 1,
    },
  ];

  key = '';
  conversationId = '';

  private readonly _subscription = new Subscription();

  constructor(
    private readonly _service: ChatService,
    private readonly _router: Router
  ) {
    this.conversationId = localStorage.getItem('conversationId');
  }

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
    if (this.key) {
      this._service.sendMessage({
        content: this.key,
      });

      const initMessage = {
        type: 'text',
        from: 1,
        content: this.key,
      };
      this.messages.push(initMessage);
      this.key = '';

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

  getSugAnswer(suggestion: Suggestion) {
    const { title, answers } = suggestion;

    this._service.selectQuestion({
      title,
      answerContent: answers[0].content,
      conversationId: this.conversationId,
    });

    const pickedSuggestion = {
      from: 1,
      type: 'text',
      content: title,
    };

    const findingAnswers = answers.map((asw) => {
      return { ...asw, type: 'text' };
    });

    this.messages = [...this.messages, pickedSuggestion, ...findingAnswers];

    this.removeOldSuggestions();
  }

  removeOldSuggestions() {
    this.messages = this.messages.filter((msg) => msg.type !== 'suggestion');
  }
}
