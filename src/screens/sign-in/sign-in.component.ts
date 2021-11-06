import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConvoService } from 'src/services/convo.service';

interface IUser {
  fullname: string;
  email: string;
  phone: string;
}
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  showBubble = true;
  user: IUser = { fullname: '', email: '', phone: '' };

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
        (res: any) => {
          localStorage.setItem('_guest', JSON.stringify(res.data.guest));
          this._router.navigate([`live-bot`]);
        },
        (err) => {
          // throw error in there
        }
      )
    );
  }
}
