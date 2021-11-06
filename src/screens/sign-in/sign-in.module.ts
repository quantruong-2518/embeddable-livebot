import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInRoutingModule } from './sign-in-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SignInComponent } from './sign-in.component';
import { ConvoService } from 'src/services/convo.service';

@NgModule({
  declarations: [SignInComponent],
  imports: [CommonModule, FormsModule, HttpClientModule, SignInRoutingModule],
  exports: [SignInComponent],
  providers: [ConvoService],
})
export class SignInModule {}
