import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'angular2-moment';
import { SharedModule } from '../shared/shared.module';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicComponent } from './topic/topic.component';
import { DiscussionComponent } from './topic/discussion/discussion.component';
import { TopicService } from './topic.service';
import { ThreadSearchInputComponent } from './topic/discussion/thread-search-input/thread-search-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    MomentModule,
    SharedModule,
    TopicRoutingModule,
  ],
  declarations: [
    TopicListComponent,
    TopicComponent,
    DiscussionComponent,
    ThreadSearchInputComponent,
  ],
  providers: [TopicService],
})
export class TopicModule {
}
