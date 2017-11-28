import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicComponent } from './topic/topic.component';
import { TopicService } from './topic.service';
import { ThreadSearchInputComponent } from './topic/sub-topic/thread-search-input/thread-search-input.component';
import { SubTopicComponent } from './topic/sub-topic/sub-topic.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TopicRoutingModule,
  ],
  declarations: [
    TopicListComponent,
    TopicComponent,
    ThreadSearchInputComponent,
    SubTopicComponent,
  ],
  providers: [TopicService],
})
export class TopicModule {
}
