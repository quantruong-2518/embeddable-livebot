import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
// import { Socket } from 'ngx-socket-io';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { SuggestionAnswer } from 'src/utils/model/suggestion.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor(private _http: HttpClient) {
    const conversationToken = localStorage.getItem('conversationToken');
    if (conversationToken) {
      this.socket = io(environment.domain, {
        query: {
          conversationToken,
        },
      });
    }
  }

  sendMessage(message: { content: string }) {
    this.socket.emit('new-question', message);
  }

  getMessage() {
    // return this.socket.fromEvent('answer-question');
    return new Observable((observer) => {
      this.socket.on('answer-question', (msg) => {
        observer.next(msg);
      });
    });
  }

  selectQuestion(message: {
    conversationId: string;
    title: string;
    answerContent: string;
  }) {
    this.socket.emit('select-question', message);
  }

  getFeatureQuestions(): Observable<any> {
    return this._http.get(`${environment.domain}/api/v1/questions/feature`);
  }

  getSensitivelyWords(): Observable<any> {
    return this._http.get(`${environment.domain}/api/v1/message-blocked`);
  }

  getCardsOnCarousel(type: number): Observable<any> {
    return this._http.get(`${environment.domain}/api/v1/cards?type=${type}`);
  }
}
