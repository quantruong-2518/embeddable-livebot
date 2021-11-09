import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConvoService } from 'src/services/convo.service';
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
  showAllButtonDisplay = false;
  showAllSugs = false;
  suggestionsLength = 0;
  fullMessages = [];

  private readonly _subscription = new Subscription();

  constructor(
    private readonly _service: ChatService,
    private readonly _router: Router,
    private readonly _convoService: ConvoService
  ) {
    this.conversationId = localStorage.getItem('conversationId');
  }

  ngOnInit(): void {
    this.listenSuggestions();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  listenSuggestions() {
    this._subscription.add(
      this._service.getMessage().subscribe((suggestions: Suggestion[]) => {
        const suggestionsFull = suggestions.map((sug) => {
          return { ...sug, type: 'suggestion' };
        });
        this.suggestionsLength = suggestions.length;

        if (suggestions.length) {
          this.postMessageToScreen(suggestionsFull);
        } else {
          this.showNotFoundMessage();
        }

        this.scrollToBottom();
      })
    );
  }

  postMessageToScreen(suggestions: Suggestion[]) {
    // select question immediately if only have 1 question
    const isOnlyOneQuestion = suggestions.length === 1;
    if (isOnlyOneQuestion) {
      this.getSugAnswer(suggestions[0]);
    } else {
      this.fullMessages = [...this.messages, ...suggestions];

      // show all if less or equal than 3
      if (suggestions.length <= 3) {
        this.messages = this.fullMessages;
      }

      // show 3 items on the first display if greater than 3
      else if (suggestions.length > 3) {
        this.showAllButtonDisplay = true;

        if (this.showAllSugs) {
          this.messages = this.fullMessages;
        } else {
          const newThreeSugs = suggestions.slice(0, 3);
          this.messages = [...this.messages, ...newThreeSugs];
        }
      }
    }

    console.log('this.messages', this.messages);
  }

  showAll() {
    this.showAllSugs = true;
    this.showAllButtonDisplay = false;
    this.messages = this.fullMessages;

    this.scrollToBottom();
  }

  closeConversation() {
    this._subscription.add(
      this._convoService.closeConvo(this.conversationId).subscribe((res) => {
        const thankful = {
          content: 'Cảm ơn bạn đã quan tâm tới Luật Cảnh Sát Biển',
          type: 'text',
        };

        this.messages = [...this.messages, thankful];

        this.scrollToBottom();

        setTimeout(() => {
          localStorage.clear();
          this._router.navigate(['']);
        }, 1000);
      })
    );
  }

  showNotFoundMessage() {
    const notFoundMsg = {
      content:
        'Xin lỗi, câu hỏi của Bạn ngoài phạm vi "Hỏi đáp tự động Luật Cảnh sát biển Việt Nam"',
      type: 'text',
    };

    this.messages = [...this.messages, notFoundMsg];
  }

  trackByIndex(index: number): number {
    return index;
  }

  sendMessage() {
    this.resetShowAll();

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

  resetShowAll() {
    this.showAllButtonDisplay = false;
    this.showAllSugs = false;
  }

  getSugAnswer(suggestion: Suggestion) {
    this.resetShowAll();

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
    this.scrollToBottom();
  }

  removeOldSuggestions() {
    this.messages = this.messages.filter((msg) => msg.type !== 'suggestion');
  }
}
