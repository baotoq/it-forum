import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicService } from './topic.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TopicRoutingModule,
  ],
  declarations: [TopicListComponent],
  providers: [TopicService],
})
export class TopicModule {
}
