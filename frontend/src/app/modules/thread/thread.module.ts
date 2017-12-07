import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

import { ThreadRoutingModule } from './thread-routing.module';
import { ThreadComponent } from './thread/thread.component';
import { PostComponent } from './thread/post/post.component';
import { ThreadCreateComponent } from './thread-create/thread-create.component';

import { ThreadService } from './thread.service';
import { PostContentComponent } from './thread/post/post-content/post-content.component';
import { PostHeaderComponent } from './thread/post/post-header/post-header.component';
import { ReplyComponent } from './thread/reply/reply.component';
import { BadgeRoleComponent } from './thread/badge-role/badge-role.component';
import { BadgeApprovalStatusComponent } from './thread/badge-approval-status/badge-approval-status.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule,
    FroalaViewModule,
    NgbModule,
    SharedModule,
    ThreadRoutingModule,
  ],
  declarations: [
    ThreadComponent,
    ThreadCreateComponent,
    PostComponent,
    PostContentComponent,
    PostHeaderComponent,
    ReplyComponent,
    BadgeRoleComponent,
    BadgeApprovalStatusComponent,
  ],
  providers: [
    ThreadService,
  ],
})
export class ThreadModule {
}
