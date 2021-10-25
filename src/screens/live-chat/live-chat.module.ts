import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LiveChatComponent } from './live-chat.component';
import { LiveChatRoutingModule } from './live-chat-routing.module';
import { ChatService } from 'src/services/chat.service';

@NgModule({
  declarations: [LiveChatComponent],
  imports: [CommonModule, FormsModule, LiveChatRoutingModule],
  providers: [ChatService],
  exports: [LiveChatComponent],
})
export class LiveChatModule {}
