import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicComponent } from './topic/topic.component';
import { SubTopicComponent } from './topic/sub-topic/sub-topic.component';
import { ThreadSearchInputComponent } from './topic/sub-topic/thread-search-input/thread-search-input.component';

import { TopicService } from './topic.service';
import { MoveThreadDialogComponent } from './topic/sub-topic/move-thread-dialog/move-thread-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    TopicRoutingModule,
  ],
  declarations: [
    TopicListComponent,
    TopicComponent,
    SubTopicComponent,
    ThreadSearchInputComponent,
    MoveThreadDialogComponent,
  ],
  entryComponents: [
    MoveThreadDialogComponent,
  ],
  providers: [TopicService],
})
export class TopicModule {
}
