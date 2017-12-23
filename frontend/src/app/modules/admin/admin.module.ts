import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardModule } from './dashboard/dashboard.module';
import { ApproveModule } from './approve/approve.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageTopicComponent } from './manage-topic/manage-topic.component';
import { ManageUserSearchInputComponent } from './manage-user/manage-user-search-input/manage-user-search-input.component';
import { CreateTopicDialogComponent } from './manage-topic/create-topic-dialog/create-topic-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    AdminRoutingModule,
    DashboardModule,
    ApproveModule,
  ],
  declarations: [
    ManageUserComponent,
    ManageTopicComponent,
    ManageUserSearchInputComponent,
    CreateTopicDialogComponent,
  ],
  entryComponents: [
    CreateTopicDialogComponent,
  ],
})
export class AdminModule {
}
