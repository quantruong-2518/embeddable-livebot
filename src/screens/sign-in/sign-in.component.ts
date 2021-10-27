import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface IUser {
  name: string;
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
  user: IUser = { name: '', email: '', phone: '' };

  constructor(private readonly _router: Router) {}

  ngOnInit(): void {}

  goToLiveChat() {
    this.showBubble = false;
  }

  submitUser(form) {
    const isAuthenticated = true;
    this._router.navigate([`${isAuthenticated ? 'live-bot' : ''}`]);

    // console.log('user', form.value);
  }
}
