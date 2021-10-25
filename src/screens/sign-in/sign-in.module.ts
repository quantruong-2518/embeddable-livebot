import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in.component';
import { SignInRoutingModule } from './sign-in-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SignInComponent],
  imports: [CommonModule, FormsModule, SignInRoutingModule],
  exports: [SignInComponent],
})
export class SignInModule {}
