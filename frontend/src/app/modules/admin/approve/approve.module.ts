import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

import { ApproveComponent } from './approve/approve.component';
import { ApproveUserComponent } from './approve/approve-user/approve-user.component';
import { ApproveService } from './approve.service';
import { ApproveUserSearchInputComponent } from './approve/approve-user/approve-user-search-input/approve-user-search-input.component';
import { ApproveThreadComponent } from './approve/approve-thread/approve-thread.component';
import { ApprovePostComponent } from './approve/approve-post/approve-post.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    NgbModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    ApproveComponent,
    ApproveUserComponent,
    ApproveUserSearchInputComponent,
    ApproveThreadComponent,
    ApprovePostComponent,
  ],
  providers: [ApproveService],
})
export class ApproveModule {
}
