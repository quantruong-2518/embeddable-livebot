import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiveChatRoutingModule } from './live-chat-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { LiveChatComponent } from './live-chat.component';

import { ChatService } from '../../services/chat.service';
import { ConvoService } from 'src/services/convo.service';

@NgModule({
  declarations: [LiveChatComponent],
  imports: [CommonModule, FormsModule, LiveChatRoutingModule, HttpClientModule],
  providers: [ChatService, ConvoService],
  exports: [LiveChatComponent],
})
export class LiveChatModule {}
