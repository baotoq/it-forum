import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

import { ThreadRoutingModule } from './thread-routing.module';
import { ThreadComponent } from './thread/thread.component';
import { PostComponent } from './thread/post/post.component';
import { ThreadCreateComponent } from './thread-create/thread-create.component';
import { ThreadEditComponent } from './thread-edit/thread-edit.component';

import { ThreadService } from './thread.service';
import { PostContentComponent } from './thread/post/post-content/post-content.component';
import { PostHeaderComponent } from './thread/post/post-header/post-header.component';
import { ReplyComponent } from './thread/reply/reply.component';
import { ThreadPreviewComponent } from './thread-create/thread-preview/thread-preview.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    ThreadRoutingModule,
  ],
  declarations: [
    ThreadComponent,
    ThreadCreateComponent,
    ThreadEditComponent,
    PostComponent,
    PostContentComponent,
    PostHeaderComponent,
    ReplyComponent,
    ThreadPreviewComponent,
    SearchComponent,
  ],
  providers: [
    ThreadService,
  ],
})
export class ThreadModule {
}
