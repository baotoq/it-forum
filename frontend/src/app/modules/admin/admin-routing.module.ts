import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ApproveComponent } from './approve/approve/approve.component';
import { ApproveUserComponent } from './approve/approve/approve-user/approve-user.component';
import { ApproveThreadComponent } from './approve/approve/approve-thread/approve-thread.component';
import { ApprovePostComponent } from './approve/approve/approve-post/approve-post.component';
import { ManageTopicComponent } from './manage-topic/manage-topic.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

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
    path: 'approve',
    component: ApproveComponent,
    children: [
      {
        path: '', redirectTo: 'user', pathMatch: 'full',
      },
      {
        path: 'user',
        component: ApproveUserComponent,
      },
      {
        path: 'thread',
        component: ApproveThreadComponent,
      },
      {
        path: 'post',
        component: ApprovePostComponent,
      },
    ],
  },
  {
    path: 'topics',
    component: ManageTopicComponent,
  },
  {
    path: 'users',
    component: ManageUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
