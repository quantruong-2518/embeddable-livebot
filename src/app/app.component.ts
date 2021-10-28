import { Component, OnInit } from '@angular/core';

import { ChatService } from 'src/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  messages = [];

  constructor() {}

  ngOnInit() {}
}
