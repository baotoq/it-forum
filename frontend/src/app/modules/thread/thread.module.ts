import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SharedModule } from '../shared/shared.module';

import { ThreadRoutingModule } from './thread-routing.module';
import { ThreadComponent } from './thread/thread.component';
import { PostComponent } from './thread/post/post.component';
import { ThreadDetailComponent } from './thread/thread-detail/thread-detail.component';
import { ThreadCreateComponent } from './thread-create/thread-create.component';

import { ThreadService } from './thread.service';
import { QuoteComponent } from './thread/quote/quote.component';
import { PostContentComponent } from './thread/post-content/post-content.component';
import { PostHeaderComponent } from './thread/post/post-header/post-header.component';
import { ThreadHeaderComponent } from './thread/thread-detail/thread-header/thread-header.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule,
    FroalaViewModule,
    SharedModule,
    ThreadRoutingModule,
  ],
  declarations: [
    ThreadComponent,
    ThreadCreateComponent,
    PostComponent,
    ThreadDetailComponent,
    QuoteComponent,
    PostContentComponent,
    PostHeaderComponent,
    ThreadHeaderComponent,
  ],
  providers: [
    ThreadService,
  ],
})
export class ThreadModule {
}
