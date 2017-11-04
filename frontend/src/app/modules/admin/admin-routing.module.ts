import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { UserConfirmComponent } from './confirm/user-confirm/user-confirm.component';
import { ThreadConfirmComponent } from './confirm/thread-confirm/thread-confirm.component';
import { PostConfirmComponent } from './confirm/post-confirm/post-confirm.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'confirm',
    component: ConfirmComponent,
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
      },
      {
        path: 'user',
        component: UserConfirmComponent,
      },
      {
        path: 'thread',
        component: ThreadConfirmComponent,
      },
      {
        path: 'post',
        component: PostConfirmComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
