import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../screens/sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  {
    path: 'live-bot',
    loadChildren: () =>
      import('../screens/live-chat/live-chat.module').then(
        (m) => m.LiveChatModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
