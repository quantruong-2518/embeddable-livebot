import { Component, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ConvoService } from 'src/services/convo.service';

import { IUser } from 'src/utils/model/user.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  showBubble = true;
  user: IUser = { fullname: '', email: '', phone: '' };

  private socket: Socket;

  private _subscription = new Subscription();

  constructor(
    private readonly _router: Router,
    private readonly _convoService: ConvoService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  goToLiveChat() {
    this.showBubble = false;
  }

  submitUser(form) {
    const signingGuest = {
      guest: form.value,
    };

    this._subscription.add(
      this._convoService.createConvo(signingGuest).subscribe(
        ({ data }) => {
          localStorage.setItem('conversationToken', data.conversationToken);
          localStorage.setItem('conversationId', data.conversationId);

          setTimeout(() => {
            this._router.navigate([`live-bot`]);
          }, 0);
        },
        (err) => {
          // throw error in there
        }
      )
    );
  }
}
