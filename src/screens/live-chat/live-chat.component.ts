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
      content: `Chào mừng  đến với chatbot của Cảnh sát biển Việt Nam`,
    },
    {
      content: 'Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn',
      type: 'text',
    },
  ];

  key = '';
  conversationId = '';
  showAllButtonDisplay = false;
  showAllSugs = false;
  suggestionsLength = 0;
  fullMessages = [];

  // cards = [
  //   {
  //     image:
  //       'https://external.xx.fbcdn.net/safe_image.php?d=AQH9moTGtxAW3b2N&url=https%3A%2F%2Fmedia.botbanhang.vn%2Fuploads%2F60bc6f802c112d00122010a2%2F0dc940e4-49e5-4f8b-8bbb-c07193efed3f.jpg&ext=emg0&_nc_oe=6f13c&_nc_sid=f281cc&ccb=3-5&_nc_hash=AQEWo_k7o2UCJWV3',
  //     title: 'Nhiệm vụ, quyền hạn của Cảnh sát biển Việt Nam',
  //     category: '🇻🇳 Cảnh sát biển Việt Nam',
  //   },
  //   {
  //     image:
  //       'https://external.xx.fbcdn.net/safe_image.php?d=AQH9moTGtxAW3b2N&url=https%3A%2F%2Fmedia.botbanhang.vn%2Fuploads%2F60bc6f802c112d00122010a2%2F0dc940e4-49e5-4f8b-8bbb-c07193efed3f.jpg&ext=emg0&_nc_oe=6f13c&_nc_sid=f281cc&ccb=3-5&_nc_hash=AQEWo_k7o2UCJWV3',
  //     title: 'Nhiệm vụ, quyền hạn của Cảnh sát biển Việt Nam',
  //     category: '🇻🇳 Cảnh sát biển Việt Nam',
  //   },
  //   {
  //     image:
  //       'https://external.xx.fbcdn.net/safe_image.php?d=AQH9moTGtxAW3b2N&url=https%3A%2F%2Fmedia.botbanhang.vn%2Fuploads%2F60bc6f802c112d00122010a2%2F0dc940e4-49e5-4f8b-8bbb-c07193efed3f.jpg&ext=emg0&_nc_oe=6f13c&_nc_sid=f281cc&ccb=3-5&_nc_hash=AQEWo_k7o2UCJWV3',
  //     title: 'Nhiệm vụ, quyền hạn của Cảnh sát biển Việt Nam',
  //     category: '🇻🇳 Cảnh sát biển Việt Nam',
  //   },
  //   {
  //     image:
  //       'https://external.xx.fbcdn.net/safe_image.php?d=AQH9moTGtxAW3b2N&url=https%3A%2F%2Fmedia.botbanhang.vn%2Fuploads%2F60bc6f802c112d00122010a2%2F0dc940e4-49e5-4f8b-8bbb-c07193efed3f.jpg&ext=emg0&_nc_oe=6f13c&_nc_sid=f281cc&ccb=3-5&_nc_hash=AQEWo_k7o2UCJWV3',
  //     title: 'Nhiệm vụ, quyền hạn của Cảnh sát biển Việt Nam',
  //     category: '🇻🇳 Cảnh sát biển Việt Nam',
  //   },
  //   {
  //     image:
  //       'https://external.xx.fbcdn.net/safe_image.php?d=AQH9moTGtxAW3b2N&url=https%3A%2F%2Fmedia.botbanhang.vn%2Fuploads%2F60bc6f802c112d00122010a2%2F0dc940e4-49e5-4f8b-8bbb-c07193efed3f.jpg&ext=emg0&_nc_oe=6f13c&_nc_sid=f281cc&ccb=3-5&_nc_hash=AQEWo_k7o2UCJWV3',
  //     title: 'Nhiệm vụ, quyền hạn của Cảnh sát biển Việt Nam',
  //     category: '🇻🇳 Cảnh sát biển Việt Nam',
  //   },
  //   {
  //     image:
  //       'https://external.xx.fbcdn.net/safe_image.php?d=AQH9moTGtxAW3b2N&url=https%3A%2F%2Fmedia.botbanhang.vn%2Fuploads%2F60bc6f802c112d00122010a2%2F0dc940e4-49e5-4f8b-8bbb-c07193efed3f.jpg&ext=emg0&_nc_oe=6f13c&_nc_sid=f281cc&ccb=3-5&_nc_hash=AQEWo_k7o2UCJWV3',
  //     title: 'Nhiệm vụ, quyền hạn của Cảnh sát biển Việt Nam',
  //     category: '🇻🇳 Cảnh sát biển Việt Nam',
  //   },
  // ];
  cards = [];

  blockedKeywords = [];

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
    this.getFeatureQuestions();
    this.getSensitivelyWords();
  }

  getSensitivelyWords() {
    this._subscription.add(
      this._service.getSensitivelyWords().subscribe((badKeywords) => {
        this.blockedKeywords = badKeywords.data.items.map((e) => e.title);
      })
    );
  }

  getFeatureQuestions() {
    this._subscription.add(
      this._service.getFeatureQuestions().subscribe((elements) => {
        this.cards = elements.data;
      })
    );
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
  }

  showAll() {
    this.showAllSugs = true;
    this.showAllButtonDisplay = false;
    this.messages = this.fullMessages;

    this.scrollToBottom();
  }

  clickOnCell(title: string) {
    const message = {
      type: 'text',
      from: 1,
      content: title,
    };

    this._service.sendMessage(message);
  }

  isSensitiveWord(key: string): boolean {
    const regex = new RegExp(this.blockedKeywords.join('|'));
    return regex.test(key);
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

    let initMessage = {
      type: 'text',
      from: 1,
      content: this.key,
    };

    if (this.key) {
      if (this.isSensitiveWord(this.key)) {
        initMessage.content =
          'Phát hiện ngôn từ không phù hợp, vui lòng nhập lại';
        initMessage.from = 2;
      } else {
        this._service.sendMessage({
          content: this.key,
        });
      }

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
