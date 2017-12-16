import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardModule } from './dashboard/dashboard.module';
import { ApproveModule } from './approve/approve.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageTopicComponent } from './manage-topic/manage-topic.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    DashboardModule,
    ApproveModule,
  ],
  declarations: [
    ManageUserComponent,
    ManageTopicComponent,
  ],
})
export class AdminModule {
}
