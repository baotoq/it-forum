import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ManageTopicComponent } from './manage-topic/manage-topic.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { UserListComponent } from './manage-user/user-list/user-list.component';
import { ApproveUserComponent } from './manage-user/approve-user/approve-user.component';
import { ManageTagsComponent } from './manage-tags/manage-tags.component';

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
    path: 'topics',
    component: ManageTopicComponent,
  },
  {
    path: 'tags',
    component: ManageTagsComponent,
  },
  {
    path: 'users',
    component: ManageUserComponent,
    children: [
      {
        path: 'approve',
        component: ApproveUserComponent,
      },
      {
        path: '',
        component: UserListComponent,
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
